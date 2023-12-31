<template>
  <div class="mt-5 flex flex-col">
    <div>
      <v-table
        :headers="headers"
        :rows="usersForTable"
        :current-page="currentPage"
        :last-page="lastPage"
        @search="debouncedSearchQuery"
        @page:next="pageNext"
        @page:prev="pagePrev"
      >
        <template #actions="{ row: user }">
          <div :class="$style.actionsContainer">
            <div v-if="user.id === currentUser.id">
              {{ capitalize($t("users.itsMe")) }}
            </div>
            <div v-else>
              <button
                type="button"
                :class="[$style.btn, $style.deleteBtn]"
                class="buttonDeleteDark"
                @click="deleteUserClick(user)"
              >
                {{ $t("users.buttonDelete") }}
              </button>
              <button
                type="button"
                :class="[$style.btn, $style.updateBtn]"
                class="darkButtonUpdate"
                @click="updateUserRoleClick(user)"
              >
                {{ $t("users.buttonUpdate") }}
              </button>
            </div>
          </div>
        </template>
      </v-table>
    </div>

    <v-modal-delete-user-confirm
      v-if="modalApproveDeleteOpened"
      @close:x="modalApproveDeleteOpened = false"
      @close="modalApproveDeleteOpened = false"
    />

    <v-modal-upate-user-role-confirm
      v-if="modalUpdateUserRoleOpened"
      @close:x="modalUpdateUserRoleOpened = false"
      @close="modalUpdateUserRoleOpened = false"
    />
  </div>
</template>

<script setup>
import { storeToRefs } from "pinia";
import { capitalize } from "lodash-es";
import VTable from "~/components/VTable.vue";
import { useUsers } from "~/composables/useUsers";
import VModalDeleteUserConfirm from "~/components/modal/users/VModalDeleteUserConfirm.vue";
import VModalUpateUserRoleConfirm from "~/components/modal/users/VModalUpateUserRoleConfirm.vue";
import { useUserStore } from "~/store/userStore";

definePageMeta({
  middleware: ["auth", "manager", "client"],
  layout: "tabs",
});

const userStore = useUserStore();
const { getUser: currentUser } = storeToRefs(userStore);

const {
  getUsers,
  modalApproveDeleteOpened,
  lastPage,
  pagePrev,
  pageNext,
  debouncedSearchQuery,
  deleteUserClick,
  loadUsers,
  currentPage,
  modalUpdateUserRoleOpened,
  updateUserRoleClick,
} = useUsers();

const { t } = useI18n();

const headers = computed(() => [
  t("users.tableHeader.id"),
  t("users.tableHeader.name"),
  t("users.tableHeader.invites"),
  t("users.tableHeader.email"),
  t("users.tableHeader.role"),
  t("users.tableHeader.phone"),
]);
const usersForTable = computed(() =>
  getUsers.value?.map((user) => ({
    id: user.id,
    name: user.name,
    totalVpnsInvites: user.totalVpnsInvites,
    email: user.email,
    role: user.role,
    phone: user.phone,
  }))
);

await loadUsers();
</script>

<style scoped>
.buttonDeleteDark {
  @apply dark:bg-red-900 dark:hover:bg-red-800;
}
.darkButtonUpdate {
  @apply dark:bg-green-900 dark:hover:bg-green-800;
}
</style>
<style module>
.table {
  @apply table-auto w-full mt-2;
}
.row:hover td {
  @apply bg-gray-200;
}
.cell {
  @apply text-center border;
}

.actionsContainer {
  @apply flex flex-col gap-1 py-1 px-2;
}

.btn {
  @apply py-0.5 text-xs px-1 rounded text-white  transition;
}

.deleteBtn {
  @apply bg-red-500 hover:bg-red-600;
}

.updateBtn {
  @apply bg-green-500  hover:bg-green-600;
}

.plusIcon {
  @apply h-[20px] w-[20px];
}
</style>
