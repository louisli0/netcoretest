using System;
using System.Linq;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using System.Net;
using Microsoft.AspNetCore.Authorization;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;
using bookingsApp.Models;

namespace bookingsApp.Controllers
{
    [Authorize(Policy = "User")]
    public class AdminController : Controller
    {
        private readonly BookingContext context;
        private readonly ILogger _logger;
        private readonly IHttpClientFactory _httpClientFactory;
        private string _accessToken;

        public AdminController(BookingContext db, ILogger<BookingContext> logger, IHttpClientFactory client)
        {
            context = db;
            _logger = logger;
            _httpClientFactory = client;
        }
        private async Task getAuthToken()
        {
            try
            {
                const string tokenURL = "http://localhost:8080/auth/realms/myrealm/protocol/openid-connect/token";
                var parameters = new Dictionary<string, string>
            {
                { "client_id", "apiController" },
                { "grant_type", "client_credentials" },
                //{ "client_secret", "c3a18a3f-23d7-4e0c-9025-2100f55be264" }, //macOS
                { "client_secret", "68ae7841-39cc-4c05-a22d-808ed32c632a" }, //Windows
            };

                var encodedFormat = new FormUrlEncodedContent(parameters);
                var response = await _httpClientFactory.CreateClient().PostAsync(tokenURL, encodedFormat);
                var responseText = await response.Content.ReadAsStringAsync();

                JObject responseObj = JObject.Parse(responseText.ToString());
                _accessToken = responseObj.GetValue("access_token").ToString();
                _logger.LogInformation("Access Token: " + _accessToken);
            }
            catch (HttpRequestException e)
            {
                _logger.LogError("Request Exception " + e);
            }
        }
        //Update User Object in LocalDB.
        private async void updateLocalUserDb(dynamic data, string type)
        {
            dynamic dataObj = JsonConvert.DeserializeObject(data.ToString());

            Console.WriteLine("Update User Entry Received: " + dataObj);
            string userID = dataObj.id;
            var userEntry = from user in context.users
                            where user.uuid == userID
                            select user;

            User userObj = userEntry.FirstOrDefault();
            if (userObj != null)
            {
                Console.WriteLine("Update Entry");
                switch (type)
                {
                    case "email":
                        userObj.email = dataObj.email;
                        break;
                    case "name":
                        userObj.name = dataObj.firstName + " " + dataObj.lastName;
                        break;
                    default:
                        _logger.LogInformation("Local DB User Update: Unknown Action");
                        break;
                };
                await context.SaveChangesAsync();
                _logger.LogInformation("User Entry updated");
                
            }
        }

        [HttpGet]
        public async Task<IActionResult> getLocalUserEntry(string id)
        {
            _logger.LogInformation("Finding user entry for; " + id);
            var userEntry = from user in context.users
                            where user.uuid.ToLower() == id.ToLower()
                            select new {
                                id = user.userID,
                                name = user.name,
                                email = user.email,
                                phone = user.phone
                            };

            var userObj = await userEntry.FirstOrDefaultAsync();
            if (userObj != null)
            {
                _logger.LogInformation("Local User found");
                return Json(userObj);
            }
            else
            {
                _logger.LogInformation("Local user not found");
                return NoContent();
            }
        }

        [HttpPut]
        public async Task<IActionResult> updateUserLoc([FromBody] dynamic data)
        {
            _logger.LogInformation("Updating User Loc ID");
            dynamic dataObj = JsonConvert.DeserializeObject(data.ToString());
            string uID = dataObj.id;
            int locationId = dataObj.locationID;
            var singleUser = from user in context.users
                             where user.uuid == uID
                             select new User { userID = user.userID };


            var addLocation = from location in context.locations
                              where location.locationId == locationId
                              select new Location { locationId = location.locationId };

            User userObj = singleUser.FirstOrDefault();
            Location locationObj = addLocation.FirstOrDefault();

            if (userObj != null && locationObj != null)
            {
                //Create LocationStaff Entry
                LocationStaff newEntry = new LocationStaff
                {
                    locationID = locationObj.locationId,
                    userID = userObj.userID
                };

                context.staff.Add(newEntry);
                await context.SaveChangesAsync();
                return Json(userObj);
            }
            else
            {
                _logger.LogInformation("User was not found");
                return BadRequest();
            }
        }

        [HttpPut]
        public async Task<IActionResult> addUserEntry([FromBody] dynamic data)
        {
            _logger.LogInformation("Adding Local Entry");
            try
            {
                dynamic dataObj = JsonConvert.DeserializeObject(data.ToString());
                var newUser = new bookingsApp.Models.User
                {
                    uuid = dataObj.id,
                    name = dataObj.name,
                    email = dataObj.email
                };
                context.users.Add(newUser);
                await context.SaveChangesAsync();
                return Json(newUser.userID);
            }
            catch (Exception e)
            {
                _logger.LogError("Unable to create local user entry" + e);
                return BadRequest();
            }
        }

        [HttpPut]
        public async Task<IActionResult> updateEmail([FromBody] dynamic data)
        {
            await getAuthToken();
            _logger.LogInformation("Update Email");
            try
            {
                dynamic dataObj = JsonConvert.DeserializeObject(data.ToString());
                string userURL = "http://localhost:8080/auth/admin/realms/myrealm/users/" + dataObj.id;

                var sendObject = new
                {
                    email = dataObj.email,
                    emailVerified = false
                };

                string content = JsonConvert.SerializeObject(sendObject);
                var byteContent = new StringContent(content, System.Text.Encoding.UTF8, "application/json");

                var client = _httpClientFactory.CreateClient();
                client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", _accessToken);

                HttpResponseMessage response = await client.PutAsync(userURL, byteContent);
                if (response.IsSuccessStatusCode)
                {
                    
                    ////////////////////////////////////////////
                    //TMP: Test without SMTP in Keycloak
                    updateLocalUserDb(data, "email");
                    ////////////////////////////////////////////

                    //Send Verification email
                    string emailUrl = userURL + "/send-verify-email";
                    Console.WriteLine(emailUrl);
                    HttpResponseMessage emailVerification = await client.PutAsync(emailUrl, null);
                    if (emailVerification.IsSuccessStatusCode && response.IsSuccessStatusCode)
                    {
                        Console.WriteLine("Email Verification Sent! & Updated");
                        await updateLocalUserDb(data, "email");
                        return Json(response.IsSuccessStatusCode);
                    }
                    else
                    {
                        return Json("Failed: Unable to send verification action");
                    }

                }
                else
                {
                    return Json("Unable to update user email");
                }
            }
            catch (Exception e)
            {
                _logger.LogError("Unable to update email" + e);
                return BadRequest();
            }
        }

        [HttpPut]
        public async Task<IActionResult> updatePassword([FromBody] dynamic data)
        {
            try
            {
                await getAuthToken();
                _logger.LogInformation("Update Password");
                dynamic dataObj = JsonConvert.DeserializeObject(data.ToString());
                string userURL = "http://localhost:8080/auth/admin/realms/myrealm/users/" + dataObj.id + "/reset-password";
                var sendObject = new
                {
                    value = dataObj.password,
                    temporary = false,
                    type = "password"
                };

                string content = JsonConvert.SerializeObject(sendObject);
                var byteContent = new StringContent(content, System.Text.Encoding.UTF8, "application/json");

                var client = _httpClientFactory.CreateClient();
                client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", _accessToken);

                Task<HttpResponseMessage> test = client.PutAsync(userURL, byteContent);
                if (test.Result.StatusCode == HttpStatusCode.NoContent)
                {
                    return NoContent();
                }
                else
                {
                    return Json("Failed");
                }
            }
            catch (Exception e)
            {
                _logger.LogError("Unable to change password " + e);
                return BadRequest();
            }
        }

        [HttpPut]
        public async Task<IActionResult> updateName([FromBody] dynamic data)
        {
            _logger.LogInformation("Admin Controller: UpdateName");
            try
            {
                //Send as User Rep to API
                await getAuthToken();
                dynamic dataObj = JsonConvert.DeserializeObject(data.ToString());
                _logger.LogInformation("Update Name");
                string userURL = "http://localhost:8080/auth/admin/realms/myrealm/users/" + dataObj.id;

                var sendObject = new
                {
                    firstName = dataObj.firstName,
                    lastName = dataObj.lastName
                };

                string content = JsonConvert.SerializeObject(sendObject);
                var byteContent = new StringContent(content, System.Text.Encoding.UTF8, "application/json");

                var client = _httpClientFactory.CreateClient();
                client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", _accessToken);

                HttpResponseMessage test = await client.PutAsync(userURL, byteContent);
                if (test.StatusCode == HttpStatusCode.NoContent)
                {
                    updateLocalUserDb(data, "name");
                    _logger.LogInformation("Updated name");
                    return NoContent();
                }
                else
                {
                    return Json("Failed");
                }
            }
            catch (Exception e)
            {
                _logger.LogError("Unable to update name " + e);
                return BadRequest();
            }
        }

        [HttpPut]
        public async Task<IActionResult> updatePhone([FromBody] dynamic data) {
            try {
                var dataObj = JsonConvert.DeserializeObject(data.ToString());
                string uuid = dataObj.id;
                var singleUser = from user in context.users
                                where user.uuid == uuid
                                select user;
                User userObj = await singleUser.FirstOrDefaultAsync();

                if(userObj != null) {
                    userObj.phone = dataObj.phone;
                    await context.SaveChangesAsync();
                    return NoContent();
                } else {
                    throw new Exception("User not found");
                }
            } catch(Exception e) {
                _logger.LogInformation("Update Phone User: " + e);
                return StatusCode(500);
            }
        }
    
    }
}