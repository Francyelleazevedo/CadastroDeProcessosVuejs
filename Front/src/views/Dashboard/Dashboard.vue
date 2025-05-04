<template>
  <div class="dashboard">
    <h1>Dashboard</h1>
    <p>Bem-vindo ao Dashboard</p>
    <prime-button label="Voltar" @click="$router.push('/')" />
  </div>
</template>

<script>
export default {
  name: 'DashboardView'
}
</script>

<style>
.dashboard {
  padding: 20px;
}
</style>