<template>
  <div class="row">
    <div
      v-for="(imageArray, index) in savedImages"
      :key="index"
      class="col-md-3 card"
    >
      <img :src="imageArray.image" alt="Image" class="mb-3" />
      <div
        v-for="(imageArray, imageIndex) in imageArray.items"
        :key="imageIndex"
        class="d-flex justify-content-center align-items-center"
      >
        <p v-if="imageIndex === 0">
          <strong>Cabinets:</strong> {{ imageArray.name }}
        </p>
        <p v-else-if="imageIndex === 1">
          <strong>Floors:</strong> {{ imageArray.name }}
        </p>
        <p v-else><strong>Walls:</strong> {{ imageArray.name }}</p>
      </div>
      <div class="d-flex flex-direction-row justify-content-center">
        <button
          @click="downloadImage(imageArray.image)"
          class="download-button"
        >
          Download
        </button>
        <button @click="deleteImage(index)" class="delete-button">
          Delete
        </button>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    savedImages: Array,
  },
  methods: {
    async downloadImage(image) {
      try {
        await this.$nextTick();

        const dataUrl = image;

        // create a download link for the saved image
        const a = document.createElement("a");
        a.href = dataUrl;
        a.download = "compiled_image.png";
        a.click();
      } catch (error) {
        console.error("Error downloading image:", error);
      }
    },
    deleteImage(index) {
      this.$emit("delete-image", index);
    },
  },
};
</script>
<style>
.card {
  border: none;
  padding: 15px;
  margin: 55px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
}

.download-button {
  background-color: rgb(6, 204, 102);
  margin-right: 10px;
  color: white;
  font-weight: bold;
  border: none;
  border-radius: 5px;
  padding: 12px 20px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.download-button:hover {
  background-color: rgba(6, 204, 102, 0.8);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
}

.delete-button {
  background-color: rgb(212, 49, 8);
  margin-right: 10px;
  color: white;
  font-weight: bold;
  border: none;
  border-radius: 5px;
  padding: 12px 20px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.delete-button:hover {
  background-color: rgba(212, 49, 8, 0.8);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
}
</style>