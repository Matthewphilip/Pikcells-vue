<template>
  <div id="app">
    <div class="container">
      <div class="row">
        <div class="col-12">
          <ProductView v-if="dataLoaded" :layers="layers" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import ProductView from "./components/ProductView.vue";

export default {
  name: "App",
  components: {
    ProductView,
  },

  data() {
    return {
      layers: [],
      dataLoaded: false,
    };
  },

  mounted() {
    fetch(`https://lab.pikcells.com/code-exercise/data.json`)
      .then((response) => response.json())
      .then((response) => {
        this.layers = response.layers;
        console.log("response layers: ", this.layers);

        // order items in the items objects into ascending order using layers.items.order value
        for (const layer of this.layers) {
          layer.items.sort((a, b) => a.order - b.order);
        }

        this.dataLoaded = true;
        console.log("response layers reordered: ", this.layers);
      })
      .catch((error) => {
        console.log(error);
      });
  },
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
