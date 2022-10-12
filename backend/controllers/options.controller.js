exports.handleOptionReq = (req, res) => {
    res.set({
        "Access-Control-Allow-Headers" : "Content-Type,x-access-token",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "OPTIONS,POST,GET,DELETE"
      });
    res.status(200).send({ message: "hello from EternalStore" });
};