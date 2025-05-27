
const uploadImage = async (img: File) => {
  try {
    let formData = new FormData();
    formData.append('image', img);


    const response = await fetch(`https://api.imgbb.com/1/upload?key=9f37c59aee0d043b16ae697f3841385d`, {
      method: 'POST',
      body: formData
    });

    const data = await response.json();

    let imageUrl = data.data.display_url;
    let deleteUrl = data.data.delete_url;
    return { imageUrl, deleteUrl };
  } catch (error) {
    console.log(error, "error");
    return null;
  }
};

export default uploadImage;