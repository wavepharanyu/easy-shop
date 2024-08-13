import { defineStore } from "pinia";

export const useAdminUserStore = defineStore("admin-user", {
  state: () => ({
    list: [
      {
        name: "Mike",
        role: "admin",
        status: "active",
        updatedAt: "9/15/2023, 11:50:24 PM",
      },
      {
        name: "Test",
        role: "moderator",
        status: "inactive",
        updatedAt: "9/15/2023, 11:50:24 PM",
      },
      {
        name: "TP",
        role: "member",
        status: "active",
        updatedAt: "9/15/2023, 11:50:24 PM",
      },
    ],
  }),
  actions: {
    getUser(index) {
      return this.list[index];
    },
    updateUser(index, userData) {
      const fields = ["name", "role", "status"];
      for (let field of fields) {
        this.list[index][field] = userData[field];
      }
      this.list[index].updatedAt = new Date().toLocaleString();
    },
    removeUser(index) {
      this.list.splice(index, 1);
    },
  },
});
