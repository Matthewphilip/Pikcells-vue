<template>
  <div v-if="this.isDataLoaded">
    <div class="container">
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
                <h3 v-if="layer.order === 0">Cabinets</h3>
                <h3 v-else-if="layer.order === 1">Floors</h3>
                <h3 v-else-if="layer.order === 2">Walls</h3>
                <span v-else>Unknown</span>
              </div>
              <div v-for="item in layer.items" :key="item.id" class="item">
                <p
                  @click="toggleSelection(item)"
                  :class="{ 'selected-item': item.selected }"
                >
                  {{ item.name }}
                </p>
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

        const url =
          "https://corsproxy.io/?" +
          encodeURIComponent(
            `https://lab.pikcells.com/code-exercise/images/${item.imgSrc}`
          );

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

          // add the image URL to the selected item for combining and dowloading the image later
          item.imgUrl = imageURL;
        } else {
          console.error(`Failed to fetch image for ${item.name}`);
          return null;
        }
      } catch (error) {
        console.error(error);
      }
    },

    toggleSelection(item) {
      // deselect other items with the same order (within the same section)
      this.selectedItems = this.selectedItems.filter(
        (i) => i.order !== item.order
      );

      // if the item is already selected, deselect it
      if (item.selected) {
        item.selected = false;
      } else {
        // select the clicked item and set its order
        item.selected = true;
        this.selectedItems.push(item);
        item.order = this.getNewOrder(item.order);
        console.log("SelectedItems: ", this.selectedItems);
      }
    },

    getNewOrder(existingOrder) {
      // determine the new order based on existing orders
      const orders = this.selectedItems.map((item) => item.order);
      for (let i = 0; i <= 2; i++) {
        if (!orders.includes(i)) {
          return i;
        }
      }
      // if all orders are taken, set the order to the existingOrder
      return existingOrder;
    },

    async downloadImage() {
      // capture a screenshot of the selected images container
      const imageArea = document.querySelector(".selected-images-container");
      const screenshot = await html2canvas(imageArea);

      // convert the screenshot to a data URL (image format)
      const dataUrl = screenshot.toDataURL("image/png");

      // create a download link for the image
      const a = document.createElement("a");
      a.href = dataUrl;
      a.download = "compiled_image.png";
      a.click();
    },
  },

  async created() {
    // load images for all items
    for (const layer of this.layers) {
      for (const item of layer.items) {
        await this.loadImage(item);
      }

      // //set the first item in each order to selected true
      // const initiallySelected = {}; // keep track of encountered orders

      // layer.items.forEach((item) => {
      //   if (!(layer.order in initiallySelected)) {
      //     // If order is not currently in orderMap, set it as true (encountered)
      //     initiallySelected[layer.order] = true;
      //     // set selected to true for the first item of each order
      //     item.selected = true;
      //     this.selectedItems.push(item);
      //   }
      // });

      // check if the last layer has been processed
      if (layer === this.layers[this.layers.length - 1]) {
        this.isDataLoaded = true;
      }
    }
  },
};
</script>

<style scoped>
h3 {
  margin-bottom: 0;
  font-size: 1.55rem;
  padding: 10px;
}

p {
  font-size: 0.75rem;
  margin-bottom: 0;
}

img {
  border-radius: 15px;
  /* box-shadow: 0 4px 6px rgba(0, 0, 0, 0.5); */
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
}

.selected-item {
  background-color: rgb(163, 162, 162);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
  color: white;
  font-weight: bold;
}

.button {
  background-color: rgb(163, 162, 162);
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.3);
  color: white;
  font-weight: bold;
  border-radius: 5px;
  margin-top: 20px;
  /* border: none; */
  border-color: black;
}
</style>


