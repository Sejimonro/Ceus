const Message = require('../models/Message');

exports.initMessages = (socket) => {
  Message.find().then((messages) => {
    socket.emit('init', messages);
  });
};

exports.saveMessage = (io, msg) => {
  const message = new Message(msg);
  message.save().then(() => {
    io.emit('message', msg);
  });
};
