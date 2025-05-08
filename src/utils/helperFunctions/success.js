exports.successResponse = ({ res, code, data, message }) => {
    console.log(`Success Response ::: ${message}`);
    return res.status(code).json({
      status: {
        code,
        success: true,
      },
  
      response: {
        message,
        data: data || null,
      },
    });
  };
  