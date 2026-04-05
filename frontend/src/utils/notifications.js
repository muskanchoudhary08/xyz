export const getNotifications = () => {
  return JSON.parse(localStorage.getItem("notifications") || "[]");
};

export const saveNotifications = (notifications) => {
  localStorage.setItem("notifications", JSON.stringify(notifications));
};

export const addNotification = ({ title, message, type }) => {
  const notifications = getNotifications();

  const newNotification = {
    notificationId: Date.now().toString(),
    title,
    message,
    type,
    isRead: false,
    createdAt: new Date().toLocaleString(),
  };

  notifications.unshift(newNotification);
  saveNotifications(notifications);
};

export const markNotificationAsRead = (notificationId) => {
  const notifications = getNotifications().map((notif) =>
    notif.notificationId === notificationId
      ? { ...notif, isRead: true }
      : notif
  );

  saveNotifications(notifications);
};

export const clearNotifications = () => {
  localStorage.removeItem("notifications");
};