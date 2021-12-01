var session = {
  info: {
    id: undefined,
    password: undefined,
    username: undefined,
    expires: undefined,
    premium: undefined,
  },
};

// return session token, if expires refresh, if doesn't exist returns undefined
session.get = async function () {
  let info = await file.read();
  if (!info) {
    return;
  }

  session.info = JSON.parse(info);
  if (session.isExpired(new Date(session.info.expires))) {
    service.login(session.info.id);
  }

  return session.info.id;
};

session.isExpired = function (date) {
  date.setDate(date.getDate() - 1);
  return date.getTime() <= new Date().getTime();
};
