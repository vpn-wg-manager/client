import { useToast } from "vue-toastification";
import { storeToRefs } from "pinia";
import { debounce } from "lodash-es";
import { useVpnsStore } from "~/store/vpnsStore";
import { VpnStatus } from "~/api/constants";

export const useVpn = () => {
  const toast = useToast();
  const vpnStore = useVpnsStore();
  const { getVpns, getCount } = storeToRefs(vpnStore);
  const serverAddr = ref("");
  const forUserEmail = ref("");
  const count = ref(1);
  const prefix = ref("");
  const modalCreateOpened = ref(false);
  const modalApproveOpened = ref(false);
  const modalApproveName = ref("");
  const isLoading = ref(false);
  const currentPage = ref(1);
  const countOnPage = ref(20);

  const lastPage = computed(() =>
    Math.ceil(getCount.value / countOnPage.value)
  );

  const pagePrev = async () => {
    currentPage.value = currentPage.value - 1;
    const params = { page: currentPage.value, count: countOnPage.value };
    await vpnStore.loadVpns(params);
  };
  const pageNext = async () => {
    currentPage.value = currentPage.value + 1;
    const params = { page: currentPage.value, count: countOnPage.value };
    await vpnStore.loadVpns(params);
  };
  const searchQuery = async (query: string) => {
    const params = { page: currentPage.value, count: countOnPage.value, query };
    await vpnStore.loadVpns(params);
  };
  const debouncedSearchQuery = debounce(searchQuery, 500);
  const approveVpnClick = (name: string) => {
    modalApproveName.value = name;
    modalApproveOpened.value = true;
  };

  const clearFormCreationVpn = () => {
    forUserEmail.value = "";
    prefix.value = "";
  };

  const createVpn = async () => {
    isLoading.value = true;
    try {
      const data = {
        forUserEmail: forUserEmail.value,
        count: count.value,
        prefix: prefix.value,
      };
      await vpnStore.createVpn(data);
      await vpnStore.loadVpns();
      clearFormCreationVpn();
    } catch (e) {
      toast.error(getApiError(e));
    }
    isLoading.value = false;
  };

  const approveVpn = async (name: string) => {
    try {
      await vpnStore.approveVpn(name, VpnStatus.Approved);
      await vpnStore.loadVpns();
    } catch (e) {
      toast.error(getApiError(e));
    }
  };

  const loadVpns = async () => {
    try {
      await vpnStore.loadVpns();
    } catch (e) {
      toast.error(getApiError(e));
    }
  };

  return {
    serverAddr,
    forUserEmail,
    count,
    prefix,
    loadVpns,
    getVpns,
    modalApproveOpened,
    modalCreateOpened,
    approveVpnClick,
    approveVpn,
    isLoading,
    createVpn,
    modalApproveName,
    currentPage,
    lastPage,
    pagePrev,
    pageNext,
    debouncedSearchQuery,
  };
};
