export const uploadToCloudinary = async (file) => {
    const url = `https://api.cloudinary.com/v1_1/ddgydffcg/upload`;
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "sensible-preset");
  
    const res = await fetch(url, {
      method: "POST",
      body: formData,
    });
  
    if (!res.ok) throw new Error("Upload failed");
    const data = await res.json();
    return data.secure_url;
  };
  