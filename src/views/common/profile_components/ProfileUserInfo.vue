<template>
  <div class="user-info-container">
    <h3>User Information</h3>
    <div class="user-info">
      <div class="user-info-item">
        <label>Username:</label>
        <span>{{ userName }}</span>
      </div>
      <div class="user-info-item">
        <label>Role:</label>
        <span>{{ userRole }}</span>
      </div>
      <button @click="toggleEditForm" class="edit-button">
        {{ isEditing ? "Cancel" : "Edit" }}
      </button>
    </div>

    <div v-if="isEditing" class="edit-form">
      <h3>Edit Information</h3>
      <div class="edit-info-item">
        <label>Username:</label>
        <input v-model="editUserName" type="text" />
      </div>
      <button @click="saveUserInfo" class="save-button">Save</button>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  data() {
    return {
      isEditing: false,
      editUserName: "",
    };
  },
  computed: {
    ...mapGetters(["getUserId", "getUserName", "getUserRole"]),
    userId() {
      return this.getUserId;
    },
    userName() {
      return this.getUserName;
    },
    userRole() {
      return this.getUserRole;
    },
  },
  methods: {
    toggleEditForm() {
      this.isEditing = !this.isEditing;
      if (this.isEditing) {
        this.editUserName = this.userName;
      }
    },
    saveUserInfo() {
      const form = {
        user_id: this.userId,
        user_name: this.editUserName,
      };
      // Add logic here to save the updated user information
      // For example, send a POST request to the server to update user details
      if (this.userName.equals(this.editUserName)) {
        alert("같은 닉네임으로 변경할 수 없습니다.");
      } else {
        this.$axios
          .post(this.$serverUrl + "/user/update", form, {
            headers: {
              "Content-Type": "application/json",
            },
          })
          .then(() => {
            // Update the state with the new values
            this.$store.commit("SET_USER_NAME", this.editUserName);

            // End the editing mode
            this.isEditing = false;

            alert("User information updated successfully.");
          })
          .catch((error) => {
            console.error("Failed to update user information:", error);
            alert("Failed to update user information.");
          });
      }
    },
  },
};
</script>

<style scoped>
.user-info-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
}

.user-info-item {
  margin-bottom: 10px;
}

label {
  font-weight: bold;
  margin-right: 10px;
}

.edit-button,
.save-button {
  background-color: #42b883;
  color: white;
  border: none;
  padding: 8px 12px;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;
  margin-top: 10px;
}

.edit-button:hover,
.save-button:hover {
  background-color: #2c3e50;
}

.edit-form {
  margin-top: 20px;
}

.edit-info-item {
  margin-bottom: 10px;
}

input[type="text"],
input[type="email"] {
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
  width: 100%;
  max-width: 400px;
}
</style>
