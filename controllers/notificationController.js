const { createNotification, allNotifications, findNotificationById, updateNotification, removeNotification } = require("../models/notifications");

exports.createNotification = async(req, res) => {
    const { userId, message } = req.body;

    try {
        if ( !userId || !message) {
            return res.status(400).json({ message: 'Missing required fields' });
        }
        const result = await createNotification(userId, message);
        const notification = await findNotificationById(result.insertId)
        return res.status(201).json({success: true, notification});
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: "Internal server error !"});
    }
}

exports.allNotifications = async(req, res) => {
    try {
        const notifications = await allNotifications();
        return res.status(200).json({success: true, notifications});
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: "Internal server error !"})
    }
}

exports.getNotificationById = async(req, res) => {
    const { id } = req.params;
    try {
        if (!id) {
            return res.status(400).json({ message: 'Missing required fields' });
        }

        const notification = await findNotificationById(id);
        if (!notification) {
            return res.status(404).json({ message: 'Notification not found' });
        }

        return res.status(200).json({success: true, notification});
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: "Internal server error !"})        
    }
}

exports.markAsRead = async(req, res) => {
    const { id } = req.params;
    try {
        if (!id) {
            return res.status(400).json({ message: 'Missing required fields' });
        }

        await updateNotification(id, {is_read: true});
        res.status(200).json({success: true, message: 'Notification marked as read'});
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: "Internal server error !"});
    }
}

exports.deleteNotificationById = async(req, res) => {
    const { id } = req.params;
    try {
        if (!id) {
            return res.status(400).json({ message: 'Missing required fields' });
        }

        await removeNotification(id);
        res.status(200).json({ success: true, message: "Notification deleted successfully."})
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: "Internal server error !"});
    }
}