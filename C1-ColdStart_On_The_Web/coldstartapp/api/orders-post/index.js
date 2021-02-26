const { getUser } = require('../shared/user-utils');
const { QueueServiceClient } = require('@azure/storage-queue');
const { v4: uuidv4 } = require('uuid');

module.exports = async function (context, req) {
  // Get the user details from the request
  const user = getUser(req);
  if (!user) {
    context.res.status(401);
    return;
  }

  // Get the connection string
  // Using QueueServiceClient to manage all the queues in storage
  const connectionString = process.env.AZURE_STORAGE_CONNECTIONSTRING;
  const queueServiceClient = QueueServiceClient.fromConnectionString(
    connectionString
  );

  // Create orders queue if not exists
  const queueClient = queueServiceClient.getQueueClient('orders');
  await queueClient.createIfNotExists();

  // Get the pre-order from the request
  const order = {
    Id: uuidv4(),
    User: user.userDetails,
    Date: new Date().toJSON(),
    IcecreamId: req.body.icecreamId,
    Status: 'New',
    DriverId: null,
    FullAddress: '1 Microsoft Way, Redmond, WA 98052, USA',
    LastPosition: null,
  };

  // console.log("\nAdding messages to the queue...");
  await queueClient.sendMessage(JSON.stringify(order));

  context.res.status(201);
  context.res.body = order;
};