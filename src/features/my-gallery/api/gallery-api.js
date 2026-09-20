import apiClient from "@/lib/axios";

export async function getOwnershipSummary(keyword = "") {
  const response = await apiClient.get("/users/me/ownerships/summary", {
    params: { keyword: keyword.trim() || undefined },
  });
  return response.data?.data ?? response.data;
}

export async function getMyOwnerships(filters = {}) {
  const {
    keyword,
    grade,
    category,
    cursor,
    limit,
  } = filters;

  const response = await apiClient.get("/users/me/ownerships",{
    params: {
      keyword,
      grade,
      category,
      cursor,
      limit
    }
  })
  return response.data?.data ?? response.data;
}
export async function getPhotoCardCreationStatus() {
  const response = await apiClient.get(
    "/users/me/photo-card-creation"
  );
  return response.data?.data ?? response.data;
}
