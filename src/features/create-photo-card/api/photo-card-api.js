import apiClient from "@/lib/axios";

export async function createPhotoCard({
  imageFile,
  name,
  grade,
  category,
  description,
  totalSupply,
}) {
  const formData = new FormData();

  formData.append("image", imageFile);
  formData.append("name", name.trim());
  formData.append("grade", grade);
  formData.append("category", category);
  formData.append("totalSupply", totalSupply);

  if (description.trim()) {
    formData.append(
      "description",
      description.trim()
    );
  }

  const response = await apiClient.post(
    "/photo-cards",
    formData
  );

  return response.data?.data ?? response.data;
}