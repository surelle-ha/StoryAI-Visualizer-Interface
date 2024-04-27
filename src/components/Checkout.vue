<template>
    <Dialog v-model:visible="displayCheckout" modal header="Edit Profile" :style="{ width: '25rem' }">
        <span class="p-text-secondary block mb-5">Update your information.</span>
        <div class="flex align-items-center gap-3 mb-3">
            <label for="username" class="font-semibold w-6rem">Username</label>
            <InputText id="username" class="flex-auto" autocomplete="off" />
        </div>
        <div class="flex align-items-center gap-3 mb-5">
            <label for="email" class="font-semibold w-6rem">Email</label>
            <InputText id="email" class="flex-auto" autocomplete="off" />
        </div>
        <div class="flex justify-content-end gap-2">
            <Button type="button" label="Cancel" severity="secondary" @click="displayCheckout = false"></Button>
            <Button type="button" label="Save" @click="displayCheckout = !displayCheckout"></Button>
        </div>
    </Dialog>
</template>

<script setup>

</script>

<style lang="scss" scoped>

</style>