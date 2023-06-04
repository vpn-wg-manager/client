import { useUserStore } from "~/store/userStore";
import { UserRoles } from "~/api/constants";

export const canUserLoadServers = () => {
  const userStore = useUserStore();
  return userStore.getUserRole === UserRoles.SuperAdmin;
};
export const canUserLoadVpns = (): boolean => {
  const userStore = useUserStore();
  return [UserRoles.SuperAdmin, UserRoles.Manager].includes(
    userStore.getUserRole
  );
};
