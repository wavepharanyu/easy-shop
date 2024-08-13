<script setup>
import UserLayout from '../../layouts/UserLayout.vue'
import ProfileIcon from '../../assets/icons/profile.png'
import { ref, onMounted } from "vue";

const profileImageUrl = ref(ProfileIcon)
const email = ref('')
const name = ref('')

const handleFileUpload = (event) => {
  const file = event.target.files[0]

  if(file){
    const reader = new FileReader()
    reader.onload = (e) => {
      profileImageUrl.value = e.target.result
    }
    reader.readAsDataURL(file)
  }
}
const updateProfile = (event) => {
  const profileData = {
    imageUrl: profileImageUrl.value,
    name: name.value,
    email: email.value
  }
  localStorage.setItem('profile-data', JSON.stringify(profileData))
}

onMounted(() => {
  let profileData = localStorage.getItem('profile-data')
  if(profileData){
    profileData = JSON.parse(profileData)
    profileImageUrl.value = profileData.imageUrl
    name.value = profileData.name
    email.value = profileData.email
  }
})

</script>

<template>
  <UserLayout>
    <div class="max-w-2xl mx-auto boder border-base-200 shadow-xl p-8 my-4">
      <div class="font-bold text-2xl">Profile</div>
      <div class="flex flex-col items-center">
        <div class="flex flex-col items-center">
          <div class="w-40 rounded-full">
            <img :src="profileImageUrl"/>
          </div>
          <input type="file" @change="handleFileUpload"/>
        </div>
        <div class="form-control w-full">
          <label class="form-control w-full">
            <div class="label">
              <span class="label-text">Email</span>
            </div>
            <input
              type="text"
              placeholder="Type here"
              class="input input-bordered w-full"
              v-model="email"
            />
          </label>
        </div>
        <div class="form-control w-full">
          <label class="form-control w-full">
            <div class="label">
              <span class="label-text">Name</span>
            </div>
            <input
              type="text"
              placeholder="Type here"
              class="input input-bordered w-full"
              v-model="name"
            />
          </label>
        </div>
        <button @click="updateProfile" class="btn btn-neutral w-full mt-4">Update Profile</button>
      </div>
    </div>
  </UserLayout>
</template>
