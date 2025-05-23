<template>
    <div class="router-info">
        <h3>Route Information</h3>
        <p>Path: {{ route.path }}</p>
        <p>Full Path: {{ route.fullPath }}</p>
        <p>Query: {{ route.query }}</p>
        <p>Hash: {{ route.hash }}</p>
        <p>Params: {{ route.params }}</p>
    </div>
</template>

<script lang="ts" setup>
import { useRoute } from 'vue-router';

const route = useRoute();   

</script>

<style scoped>
.router-info {
    padding: 20px;
    background-color: #f9f9f9;
    border-radius: 5px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    color: black;
}
.router-info h3 {
    margin-bottom: 10px;
}
.router-info p {
    margin: 5px 0;
}
</style>