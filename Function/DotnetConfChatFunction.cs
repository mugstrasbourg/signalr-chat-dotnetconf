using System;
using System.IO;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Extensions.Http;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;
using Microsoft.Azure.WebJobs.Extensions.SignalRService;
using System.Net.Http;

namespace MUGStrasbourg.Function
{
    public static class DotnetConfChatFunction
    {
        [FunctionName("getconnection")]
        public static SignalRConnectionInfo GetSignalRInfo(
            [HttpTrigger(AuthorizationLevel.Anonymous)] HttpRequest req,
            [SignalRConnectionInfo(HubName = "simplechat")] SignalRConnectionInfo connectionInfo)
        {
            return connectionInfo;
        }

        [FunctionName("sendmessage")]
        public static async Task Run(
            [HttpTrigger(AuthorizationLevel.Anonymous, "post")] HttpRequestMessage req,
            [SignalR(HubName = "simplechat")] IAsyncCollector<SignalRMessage> messages,
            ILogger logger)
        {
            var messageModel = await req.Content.ReadAsAsync<MessageModel>();

            logger.LogInformation("Message sended : " + messageModel.Message);

            await messages.AddAsync(
                new SignalRMessage
                {
                    Target = "notify",
                    Arguments = new[] { messageModel.Message, messageModel.Owner }
                });
        }
    }
}
