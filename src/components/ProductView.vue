<template>
  <div v-if="this.isDataLoaded">
    <div class="container">
      <h2 class="title">Pikcells Kitchen Design Service</h2>
      <div class="row" style="align-items: stretch">
        <!-- View -->
        <div class="col-9">
          <div class="selected-images-container">
            <div v-for="selectedItem in selectedItems" :key="selectedItem.id">
              <img
                :src="imageCache[selectedItem.imgSrc]"
                :alt="selectedItem.name"
                class="selected-image"
              />
            </div>
          </div>
          <button
            v-if="this.selectedItems.length > 0"
            @click="downloadImage"
            class="button"
          >
            Download Your Room Plan!
          </button>
        </div>

        <!-- Menu -->
        <div class="col-3 menu-container">
          <div v-if="layers && layers.length > 0">
            <div v-for="layer in this.layers" :key="layer.id">
              <div>
                <h3 v-if="layer.order === 0" class="menu-title">Cabinets</h3>
                <h3 v-else-if="layer.order === 1" class="menu-title">Floors</h3>
                <h3 v-else-if="layer.order === 2" class="menu-title">Walls</h3>
                <span v-else>Unknown</span>
              </div>
              <div v-for="item in layer.items" :key="item.id" class="item">
                <div @click="toggleSelection(item)">
                  <p :class="{ 'selected-item': item.selected }">
                    {{ item.name }}
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div v-else>Loading or no data available</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import html2canvas from "html2canvas";

export default {
  props: {
    layers: Array,
  },

  data() {
    return {
      imageCache: [],
      selectedItems: [],
      isDataLoaded: false,
    };
  },

  methods: {
    async loadImage(item) {
      try {
        console.log("Fetching image from URL:", item.imgSrc);

        const url = `http://localhost:8080/https://lab.pikcells.com/code-exercise/images/${item.imgSrc}`;

        const response = await fetch(url, {
          method: "GET",
          mode: "cors",
          headers: {
            "Content-Type": "application/json",
          },
        });
        if (response.ok) {
          const imageURL = await response.url;
          console.log(`imageURL ${item.imgSrc}: `, imageURL);

          this.$set(this.imageCache, item.imgSrc, imageURL);
          console.log("image cach: ", this.imageCache);

          // add the image URL to the item for combining and dowloading the image later
          item.imgUrl = imageURL;
          console.log(item);
        } else {
          console.error(`Failed to fetch image for ${item.name}`);
          return null;
        }
      } catch (error) {
        console.error(error);
      }
    },

    toggleSelection(item) {
      this.layers.forEach((layer) => {
        // check which if any layer yet contains the item
        const layerContainsItem = layer.items.some(
          (i) => i.imgSrc === item.imgSrc
        );

        // for the layer that does contain the item, set the rest to false if the imgSrc doesnt match item.imgSrc
        if (layerContainsItem) {
          layer.items.forEach((i) => {
            if (i.imgSrc !== item.imgSrc) {
              i.selected = false;
            }
          });
        }
      });

      // set clicked item to selected true and reset selected items array in the correct order
      item.selected = true;

      this.selectedItems = [];

      this.layers.forEach((layer) => {
        layer.items.forEach((item) => {
          if (item.selected) {
            this.selectedItems.push(item);
          }
        });
      });

      console.log("Selected items: ", this.selectedItems);
    },

    async downloadImage() {
      try {
        await this.$nextTick();

        // screenshot the images container
        const imageArea = document.querySelector(".selected-images-container");
        const screenshot = await html2canvas(imageArea, {
          useCORS: true, // if CORS issue present
        });

        // convert the screenshot to a data URL (image format)
        const dataUrl = screenshot.toDataURL("image/png");

        // reate a download link for the image
        const a = document.createElement("a");
        a.href = dataUrl;
        a.download = "compiled_image.png";
        a.click();
      } catch (error) {
        console.error("Error downloading image:", error);
      }
    },
  },

  async created() {
    // load images for all items
    for (const layer of this.layers) {
      for (const item of layer.items) {
        await this.loadImage(item);
      }

      //set the first item in each order to selected true
      const initiallySelected = {};

      layer.items.forEach((item) => {
        if (!(layer.order in initiallySelected)) {
          initiallySelected[layer.order] = true;
          // set selected to true for the first item of each order
          item.selected = true;
          this.selectedItems.push(item);
        }
      });

      console.log(this.selectedItems);

      // check if the last layer has been processed
      if (layer === this.layers[this.layers.length - 1]) {
        this.isDataLoaded = true;
      }
    }
  },
};
</script>

<style scoped>
.title {
  display: flex;
  justify-content: flex-start;
  margin-bottom: 20px;
}

h3 {
  font-size: 1.55rem;
  padding: 5px;
  border-bottom: 1px solid lightgrey;
  margin-top: 5px;
  margin-bottom: 5px;
}

p {
  font-size: 0.75rem;
  margin-bottom: 0;
}

img {
  border-radius: 15px;
}
.item {
  padding: 5px;
  border: 2px;
  border-radius: 5px;
}

.selected-images-container {
  position: relative;
  margin-right: 50px;
  width: 100%;
  height: 100%;
  border-radius: 15px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.5);
}

.selected-image {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
  transition: transform 0.3s;
}

.menu-container {
  border-color: black;
  border-radius: 15px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.5);
  height: 100%;
  overflow: auto;
  padding: 20px;
}

.selected-item {
  background-color: rgb(231, 231, 231);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
  /* color: white; */
  font-weight: bold;
}

.button {
  background-color: rgb(6, 204, 102);
  margin-top: 30px;
  color: white;
  font-weight: bold;
  border: none;
  border-radius: 5px;
  padding: 12px 20px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.button:hover {
  background-color: rgba(6, 204, 102, 0.8);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
}
</style>


