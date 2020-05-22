<template>
  <div>
      <p>Above: {{ above }} </p>
      <p>Below: {{ below }} </p>
  </div>
</template>

<script>
export default {
  props: {
    above: String,
    below: String,
  },
};
</script>

<style>

</style>