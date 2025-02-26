const { ipcMain } = require("electron");
const { getUsers, addUser, updateUser, deleteUser } = require("./utils/db");

function setupIpcHandlers() {
    ipcMain.handle("db:getUsers", async () => {
        return await getUsers();
    });

    ipcMain.handle("db:addUser", async (event, user) => {
        return await addUser(user);
    });

    ipcMain.handle("db:updateUser", async (event, user) => {
        return await updateUser(user);
    });

    ipcMain.handle("db:deleteUser", async (event, userId) => {
        return await deleteUser(userId);
    });
}

module.exports = { setupIpcHandlers };
