<template>
  <div class="page">
    <div class="addresses-wrap">
      <div class="hero-card">
        <div class="topGlow"></div>

        <div class="head hero-head">
          <div class="head-left">
            <router-link class="back" to="/account" aria-label="Volver a mi cuenta">←</router-link>

            <div class="headText">
              <p class="eyebrow">Mi cuenta · Direcciones</p>
              <h2>Mis direcciones</h2>
              <p class="muted">
                Gestiona tu dirección de facturación y varias direcciones de entrega de forma
                rápida, clara y profesional.
              </p>
            </div>
          </div>

          <button class="addBtn" type="button" @click="abrirNuevaEntrega">
            <span>+</span>
            Añadir dirección
          </button>
        </div>
      </div>

      <div class="address-grid">
        <section class="card address-card billing-card">
          <div class="sectionHead">
            <div>
              <p class="badge billing">Facturación</p>
              <h3>Dirección de facturación</h3>
              <p class="sectionMuted">Se usa para facturas y datos del comprador.</p>
            </div>
            <button class="miniBtn" type="button" @click="editandoFacturacion = !editandoFacturacion">
              {{ editandoFacturacion ? 'Cerrar' : 'Editar' }}
            </button>
          </div>

          <div v-if="!editandoFacturacion" class="addressPreview">
            <h4>{{ billingForm.nombre || 'Sin nombre' }}</h4>
            <p>{{ billingForm.telefono || 'Sin teléfono' }}</p>
            <p class="preline">{{ billingForm.direccion || 'Sin dirección guardada' }}</p>
            <div class="pillRow">
              <span class="pill primary">Predeterminada</span>
            </div>
          </div>

          <form v-else class="form" @submit.prevent="guardarFacturacion">
            <div class="field">
              <label>Nombre completo</label>
              <input v-model="billingForm.nombre" placeholder="Tu nombre" required />
            </div>

            <div class="field">
              <label>Teléfono</label>
              <input v-model="billingForm.telefono" placeholder="Tu teléfono" required />
            </div>

            <div class="field">
              <label>Dirección</label>
              <textarea
                v-model="billingForm.direccion"
                placeholder="Dirección completa"
                rows="4"
                required
              />
            </div>

            <button class="btn" type="submit" :disabled="savingBilling">
              <span v-if="savingBilling" class="spinner" aria-hidden="true"></span>
              {{ savingBilling ? 'Guardando...' : 'Guardar facturación' }}
            </button>
          </form>
        </section>

        <section class="card address-card shipping-card">
          <div class="sectionHead shippingTop">
            <div>
              <p class="badge shipping">Entregas</p>
              <h3>Direcciones de entrega</h3>
              <p class="sectionMuted">
                Aquí puedes agregar, modificar o eliminar direcciones de destinatarios.
              </p>
            </div>
            <div class="counter">{{ shippingAddresses.length }} guardadas</div>
          </div>

          <div v-if="loadingShipping" class="emptyState">Cargando direcciones...</div>

          <div v-else-if="!shippingAddresses.length" class="emptyState">
            <strong>Aún no tienes direcciones de entrega.</strong>
            <span>Añade la primera para usarla más rápido en el checkout.</span>
          </div>

          <div v-else class="shippingList">
            <article
              v-for="item in shippingAddresses"
              :key="item.id"
              class="shippingItem"
              :class="{ active: item.predeterminada }"
            >
              <div class="shippingItemHead">
                <div>
                  <h4>{{ getNombreCompleto(item) }}</h4>
                  <p class="recipient">{{ item.alias || 'Dirección de entrega' }}</p>
                </div>

                <span v-if="item.predeterminada" class="pill success">Principal</span>
              </div>

              <div class="shippingMeta">
                <span v-if="item.provincia" class="miniTag">{{ item.provincia }}</span>
                <span v-if="item.municipio" class="miniTag">{{ item.municipio }}</span>
                <span v-if="item.ciudad" class="miniTag">{{ item.ciudad }}</span>
              </div>

              <div class="shippingBody">
                <p>{{ item.telefono }}</p>
                <p v-if="item.email">{{ item.email }}</p>
                <p class="preline">{{ formatDireccion(item) }}</p>
                <p v-if="item.notas" class="notesText">Notas: {{ item.notas }}</p>
              </div>

              <div class="shippingActions">
                <button class="miniBtn" type="button" @click="editarEntrega(item)">Editar</button>
                <button
                  class="miniBtn"
                  type="button"
                  @click="marcarPredeterminada(item)"
                  :disabled="item.predeterminada || savingShipping"
                >
                  Principal
                </button>
                <button
                  class="miniBtn danger"
                  type="button"
                  @click="eliminarEntrega(item.id)"
                  :disabled="savingShipping"
                >
                  Eliminar
                </button>
              </div>
            </article>
          </div>
        </section>
      </div>

      <teleport to="body">
        <div v-if="showShippingModal" class="modalOverlay" @click.self="cerrarModalEntrega">
          <div class="modalCard modalCardBig">
            <div class="sectionHead modalHead modalHeadTop">
              <div>
                <p class="badge shipping">Entrega</p>
                <h3>{{ shippingForm.id ? 'Editar dirección' : 'Nueva Dirección' }}</h3>
                <p class="sectionMuted">Añade una nueva dirección de envío</p>
              </div>
              <button class="closeBtn" type="button" @click="cerrarModalEntrega">×</button>
            </div>

            <form class="modalForm modalFormLarge" @submit.prevent="guardarEntrega">
              <div class="field half">
                <label>Nombre</label>
                <input v-model="shippingForm.nombre" placeholder="Daniel" required />
              </div>

              <div class="field half">
                <label>Apellidos</label>
                <input v-model="shippingForm.apellidos" placeholder="Basulto Verdecia" required />
              </div>

              <div class="field half">
                <label>Email (opcional)</label>
                <input v-model="shippingForm.email" type="email" placeholder="correo@ejemplo.com" />
              </div>

              <div class="field half">
                <label>Teléfono</label>
                <input v-model="shippingForm.telefono" placeholder="+53..." required />
              </div>

              <div class="field full">
                <label>Dirección</label>
                <input
                  v-model="shippingForm.direccion"
                  placeholder="Calle, número, piso, puerta..."
                  required
                />
              </div>

              <div class="field third">
                <label>Ciudad</label>
                <input v-model="shippingForm.ciudad" placeholder="Camagüey" />
              </div>

              <div class="field third">
                <label>Código Postal</label>
                <input v-model="shippingForm.codigo_postal" placeholder="70100" />
              </div>

              <div class="field third">
                <label>Provincia</label>
                <select v-model="shippingForm.provincia" required>
                  <option value="">Selecciona una...</option>
                  <option v-for="provincia in provinces" :key="provincia" :value="provincia">
                    {{ provincia }}
                  </option>
                </select>
              </div>

              <div class="field full">
                <label>Municipio</label>
                <select v-model="shippingForm.municipio" :disabled="!shippingForm.provincia">
                  <option value="">
                    {{ shippingForm.provincia ? 'Selecciona un municipio...' : 'Primero selecciona una provincia' }}
                  </option>
                  <option
                    v-for="municipio in availableMunicipalities"
                    :key="municipio"
                    :value="municipio"
                  >
                    {{ municipio }}
                  </option>
                </select>
              </div>

              <div class="field full">
                <label>Alias</label>
                <input v-model="shippingForm.alias" placeholder="Ej: Mamá Villa Clara" required />
              </div>

              <div class="field full">
                <label>Notas (opcional)</label>
                <textarea
                  v-model="shippingForm.notas"
                  placeholder="Instrucciones especiales de entrega..."
                  rows="4"
                />
              </div>

              <label class="checkRow full">
                <input v-model="shippingForm.predeterminada" type="checkbox" />
                <span>Establecer como dirección predeterminada</span>
              </label>

              <div class="modalActions full">
                <button class="ghostBtn" type="button" @click="cerrarModalEntrega">Cancelar</button>

                <button class="btn submitBtn" type="submit" :disabled="savingShipping">
                  <span v-if="savingShipping" class="spinner" aria-hidden="true"></span>
                  {{ savingShipping ? 'Guardando...' : (shippingForm.id ? 'Actualizar dirección' : 'Guardar dirección') }}
                </button>
              </div>
            </form>
          </div>
        </div>
      </teleport>

      <p class="ok globalMsg" v-if="okMsg">{{ okMsg }}</p>
      <p class="err globalMsg" v-if="errMsg">{{ errMsg }}</p>
    </div>
  </div>
</template>

<script setup>
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { supabase } from '../../supabase'

const router = useRouter()

const user = ref(null)
const savingBilling = ref(false)
const savingShipping = ref(false)
const loadingShipping = ref(false)
const okMsg = ref('')
const errMsg = ref('')
const editandoFacturacion = ref(false)
const showShippingModal = ref(false)
const shippingSchemaMode = ref('full')

const provinces = [
  'Pinar del Río',
  'Artemisa',
  'La Habana',
  'Mayabeque',
  'Matanzas',
  'Cienfuegos',
  'Villa Clara',
  'Sancti Spíritus',
  'Ciego de Ávila',
  'Camagüey',
  'Las Tunas',
  'Holguín',
  'Granma',
  'Santiago de Cuba',
  'Guantánamo',
  'Isla de la Juventud',
]

const municipalitiesByProvince = {
  'Pinar del Río': ['Pinar del Río', 'San Luis', 'Viñales', 'Consolación del Sur'],
  Artemisa: ['Artemisa', 'Guanajay', 'San Antonio de los Baños', 'Bauta'],
  'La Habana': ['Plaza', 'Centro Habana', 'Habana Vieja', 'Cerro', 'Diez de Octubre', 'Boyeros', 'Arroyo Naranjo', 'Marianao'],
  Mayabeque: ['San José de las Lajas', 'Güines', 'Madruga', 'Melena del Sur'],
  Matanzas: ['Matanzas', 'Cárdenas', 'Colón', 'Jovellanos'],
  Cienfuegos: ['Cienfuegos', 'Palmira', 'Cruces', 'Rodas'],
  'Villa Clara': ['Santa Clara', 'Sagua la Grande', 'Placetas', 'Camajuaní', 'Remedios'],
  'Sancti Spíritus': ['Sancti Spíritus', 'Trinidad', 'Cabaiguán', 'Yaguajay'],
  'Ciego de Ávila': ['Ciego de Ávila', 'Morón', 'Venezuela', 'Baraguá'],
  Camagüey: ['Camagüey', 'Florida', 'Nuevitas', 'Guáimaro', 'Santa Cruz del Sur', 'Vertientes'],
  'Las Tunas': ['Las Tunas', 'Puerto Padre', 'Colombia', 'Amancio'],
  Holguín: ['Holguín', 'Banes', 'Gibara', 'Moa', 'Mayarí'],
  Granma: ['Bayamo', 'Manzanillo', 'Jiguaní', 'Niquero'],
  'Santiago de Cuba': ['Santiago de Cuba', 'Palma Soriano', 'Contramaestre', 'San Luis'],
  Guantánamo: ['Guantánamo', 'Baracoa', 'El Salvador', 'Maisí'],
  'Isla de la Juventud': ['Nueva Gerona'],
}

const billingForm = ref({
  nombre: '',
  telefono: '',
  direccion: '',
})

const shippingAddresses = ref([])
const shippingForm = ref(getEmptyShippingForm())

const availableMunicipalities = computed(() => {
  return municipalitiesByProvince[shippingForm.value.provincia] || []
})

watch(
  () => shippingForm.value.provincia,
  (newValue, oldValue) => {
    if (newValue !== oldValue) {
      shippingForm.value.municipio = ''
    }
  }
)

watch(showShippingModal, (isOpen) => {
  document.body.style.overflow = isOpen ? 'hidden' : ''
})

onBeforeUnmount(() => {
  document.body.style.overflow = ''
})

onMounted(async () => {
  const { data: u } = await supabase.auth.getUser()
  user.value = u.user

  if (!user.value) {
    router.push('/login')
    return
  }

  await cargarFacturacion()
  await cargarEntregas()
})

function getEmptyShippingForm() {
  return {
    id: null,
    alias: '',
    nombre: '',
    apellidos: '',
    email: '',
    telefono: '',
    direccion: '',
    ciudad: '',
    codigo_postal: '',
    provincia: '',
    municipio: '',
    notas: '',
    predeterminada: shippingAddresses.value.length === 0,
  }
}

function normalizeShippingItem(item = {}) {
  return {
    id: item.id || null,
    alias: item.alias || '',
    nombre: item.nombre || '',
    apellidos: item.apellidos || '',
    email: item.email || '',
    telefono: item.telefono || '',
    direccion: item.direccion || '',
    ciudad: item.ciudad || '',
    codigo_postal: item.codigo_postal || '',
    provincia: item.provincia || '',
    municipio: item.municipio || '',
    notas: item.notas || '',
    predeterminada: !!item.predeterminada,
  }
}

function getNombreCompleto(item) {
  return [item.nombre, item.apellidos].filter(Boolean).join(' ') || 'Sin nombre'
}

function formatDireccion(item) {
  return [
    item.direccion,
    item.ciudad,
    item.municipio,
    item.provincia,
    item.codigo_postal,
  ]
    .filter(Boolean)
    .join(', ')
}

async function cargarFacturacion() {
  const { data, error } = await supabase
    .from('profiles')
    .select('nombre, telefono, direccion')
    .eq('id', user.value.id)
    .single()

  if (!error && data) {
    billingForm.value.nombre = data.nombre || ''
    billingForm.value.telefono = data.telefono || ''
    billingForm.value.direccion = data.direccion || ''
  }
}

async function cargarEntregas() {
  loadingShipping.value = true
  limpiarMensajes()

  const fullQuery = await supabase
    .from('shipping_addresses')
    .select('id, alias, nombre, apellidos, email, telefono, direccion, ciudad, codigo_postal, provincia, municipio, notas, predeterminada')
    .eq('user_id', user.value.id)
    .order('predeterminada', { ascending: false })
    .order('created_at', { ascending: false })

  loadingShipping.value = false

  if (!fullQuery.error) {
    shippingSchemaMode.value = 'full'
    shippingAddresses.value = (fullQuery.data || []).map(normalizeShippingItem)
    return
  }

  const missingColumnError =
    fullQuery.error.code === '42703' ||
    fullQuery.error.message?.toLowerCase().includes('column') ||
    fullQuery.error.details?.toLowerCase().includes('column') ||
    fullQuery.error.hint?.toLowerCase().includes('column')

  if (!missingColumnError) {
    console.error('Error cargando shipping_addresses:', fullQuery.error)
    errMsg.value = 'No se pudieron cargar las direcciones de entrega.'
    return
  }

  const legacyQuery = await supabase
    .from('shipping_addresses')
    .select('id, alias, nombre, telefono, direccion, predeterminada')
    .eq('user_id', user.value.id)
    .order('predeterminada', { ascending: false })
    .order('created_at', { ascending: false })

  if (legacyQuery.error) {
    console.error('Error cargando shipping_addresses:', legacyQuery.error)
    errMsg.value = 'No se pudieron cargar las direcciones de entrega.'
    return
  }

  shippingSchemaMode.value = 'legacy'
  shippingAddresses.value = (legacyQuery.data || []).map(normalizeShippingItem)
  errMsg.value = 'Tu tabla shipping_addresses todavía usa la versión antigua. El modal ya funciona, pero te falta migrar las nuevas columnas en Supabase.'
}

async function guardarFacturacion() {
  if (!user.value) return

  savingBilling.value = true
  limpiarMensajes()

  const payload = {
    id: user.value.id,
    email: user.value.email,
    nombre: billingForm.value.nombre,
    telefono: billingForm.value.telefono,
    direccion: billingForm.value.direccion,
    updated_at: new Date().toISOString(),
  }

  const { error } = await supabase.from('profiles').upsert(payload, { onConflict: 'id' })

  savingBilling.value = false

  if (error) {
    console.error(error)
    errMsg.value = 'No se pudo guardar la facturación. Intenta de nuevo.'
    return
  }

  okMsg.value = '✅ Dirección de facturación guardada'
  editandoFacturacion.value = false
  clearSuccess()
}

function abrirNuevaEntrega() {
  const partesNombre = (billingForm.value.nombre || '').trim().split(/\s+/).filter(Boolean)

  shippingForm.value = {
    ...getEmptyShippingForm(),
    nombre: partesNombre[0] || '',
    apellidos: partesNombre.slice(1).join(' '),
    telefono: billingForm.value.telefono || '',
  }

  showShippingModal.value = true
}

function editarEntrega(item) {
  shippingForm.value = normalizeShippingItem(item)
  showShippingModal.value = true
}

function cerrarModalEntrega() {
  showShippingModal.value = false
  shippingForm.value = getEmptyShippingForm()
}

function buildShippingPayload() {
  const basePayload = {
    user_id: user.value.id,
    alias: shippingForm.value.alias,
    nombre: shippingForm.value.nombre,
    telefono: shippingForm.value.telefono,
    direccion: shippingForm.value.direccion,
    predeterminada: shippingForm.value.predeterminada,
    updated_at: new Date().toISOString(),
  }

  if (shippingSchemaMode.value === 'legacy') {
    return basePayload
  }

  return {
    ...basePayload,
    apellidos: shippingForm.value.apellidos,
    email: shippingForm.value.email,
    ciudad: shippingForm.value.ciudad,
    codigo_postal: shippingForm.value.codigo_postal,
    provincia: shippingForm.value.provincia,
    municipio: shippingForm.value.municipio,
    notas: shippingForm.value.notas,
  }
}

async function guardarEntrega() {
  if (!user.value) return

  savingShipping.value = true
  limpiarMensajes()

  if (shippingForm.value.predeterminada) {
    const { error: resetError } = await supabase
      .from('shipping_addresses')
      .update({ predeterminada: false, updated_at: new Date().toISOString() })
      .eq('user_id', user.value.id)

    if (resetError) {
      savingShipping.value = false
      console.error(resetError)
      errMsg.value = 'No se pudo actualizar la dirección principal.'
      return
    }
  }

  const payload = buildShippingPayload()
  let response

  if (shippingForm.value.id) {
    response = await supabase
      .from('shipping_addresses')
      .update(payload)
      .eq('id', shippingForm.value.id)
      .eq('user_id', user.value.id)
  } else {
    response = await supabase.from('shipping_addresses').insert(payload)
  }

  savingShipping.value = false

  if (response.error) {
    console.error(response.error)
    errMsg.value = 'No se pudo guardar la dirección de entrega.'
    return
  }

  okMsg.value = shippingForm.value.id
    ? '✅ Dirección de entrega actualizada'
    : '✅ Nueva dirección añadida'

  cerrarModalEntrega()
  await cargarEntregas()
  clearSuccess()
}

async function marcarPredeterminada(item) {
  if (!user.value || item.predeterminada) return

  savingShipping.value = true
  limpiarMensajes()

  const { error: resetError } = await supabase
    .from('shipping_addresses')
    .update({ predeterminada: false, updated_at: new Date().toISOString() })
    .eq('user_id', user.value.id)

  if (resetError) {
    savingShipping.value = false
    console.error(resetError)
    errMsg.value = 'No se pudo cambiar la dirección principal.'
    return
  }

  const { error } = await supabase
    .from('shipping_addresses')
    .update({ predeterminada: true, updated_at: new Date().toISOString() })
    .eq('id', item.id)
    .eq('user_id', user.value.id)

  savingShipping.value = false

  if (error) {
    console.error(error)
    errMsg.value = 'No se pudo marcar como principal.'
    return
  }

  okMsg.value = '✅ Dirección principal actualizada'
  await cargarEntregas()
  clearSuccess()
}

async function eliminarEntrega(id) {
  if (!user.value) return

  const confirmar = window.confirm('¿Seguro que quieres eliminar esta dirección?')
  if (!confirmar) return

  savingShipping.value = true
  limpiarMensajes()

  const { error } = await supabase
    .from('shipping_addresses')
    .delete()
    .eq('id', id)
    .eq('user_id', user.value.id)

  savingShipping.value = false

  if (error) {
    console.error(error)
    errMsg.value = 'No se pudo eliminar la dirección.'
    return
  }

  okMsg.value = '✅ Dirección eliminada'
  await cargarEntregas()
  clearSuccess()
}

function limpiarMensajes() {
  okMsg.value = ''
  errMsg.value = ''
}

function clearSuccess() {
  setTimeout(() => {
    okMsg.value = ''
  }, 2500)
}
</script>

<style scoped>
*,
*::before,
*::after {
  box-sizing: border-box;
}

.page {
  background:
    radial-gradient(circle at top left, rgba(34, 197, 94, 0.06), transparent 24%),
    #f5f6f8;
  display: block;
  padding: 14px;
  padding-top: 0;
  min-height: auto;
}

.addresses-wrap {
  width: 100%;
  max-width: 1160px;
  margin: 0 auto;
}

.hero-card {
  position: relative;
  overflow: hidden;
  margin: 0 auto 16px;
}

.topGlow {
  position: absolute;
  inset: 0 auto auto 0;
  width: 220px;
  height: 220px;
  background: radial-gradient(circle, rgba(34, 197, 94, 0.11), transparent 65%);
  pointer-events: none;
}

.card,
.hero-card,
.modalCard {
  background: rgba(255, 255, 255, 0.94);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.65);
  border-radius: 22px;
  box-shadow:
    0 18px 40px rgba(0, 0, 0, 0.08),
    0 6px 16px rgba(0, 0, 0, 0.04);
}

.hero-card {
  padding: 20px;
}

.address-grid {
  display: grid;
  grid-template-columns: 0.95fr 1.35fr;
  gap: 16px;
  align-items: start;
}

.address-card {
  position: relative;
  overflow: hidden;
  padding: 20px;
}

.head,
.sectionHead,
.shippingItemHead,
.shippingActions,
.pillRow,
.hero-head {
  position: relative;
  z-index: 1;
  display: flex;
  gap: 12px;
  align-items: flex-start;
  justify-content: space-between;
}

.head-left {
  display: flex;
  gap: 12px;
  align-items: flex-start;
  min-width: 0;
}

.back {
  width: 46px;
  height: 46px;
  flex: 0 0 46px;
  border-radius: 15px;
  display: grid;
  place-items: center;
  background: linear-gradient(180deg, #f3f4f6 0%, #e9edf2 100%);
  text-decoration: none;
  color: #111827;
  font-weight: 1000;
  font-size: 22px;
  border: 1px solid rgba(0, 0, 0, 0.05);
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.85);
  transition: transform 0.16s ease, box-shadow 0.16s ease;
}

.back:hover {
  transform: translateY(-1px);
  box-shadow:
    0 10px 20px rgba(0, 0, 0, 0.05),
    inset 0 1px 0 rgba(255, 255, 255, 0.85);
}

.eyebrow,
.badge {
  margin: 0 0 6px;
  font-size: 11px;
  font-weight: 1000;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.eyebrow {
  color: #16a34a;
}

.badge.billing {
  color: #2563eb;
}

.badge.shipping {
  color: #16a34a;
}

.headText {
  min-width: 0;
}

.headText h2,
.sectionHead h3 {
  margin: 0;
  color: #111827;
}

.headText h2 {
  font-size: clamp(1.45rem, 2.5vw, 2rem);
  line-height: 1.05;
  font-weight: 1000;
  letter-spacing: -0.6px;
}

.sectionHead h3 {
  font-size: clamp(1.05rem, 1.8vw, 1.35rem);
  line-height: 1.15;
  font-weight: 1000;
}

.muted,
.sectionMuted {
  margin: 6px 0 0;
  color: #6b7280;
  font-size: 13px;
  line-height: 1.45;
  font-weight: 700;
}

.addBtn,
.btn,
.miniBtn,
.ghostBtn,
.closeBtn {
  border: none;
  cursor: pointer;
  transition: transform 0.16s ease, box-shadow 0.16s ease, filter 0.16s ease;
}

.addBtn {
  min-height: 46px;
  padding: 0 16px;
  border-radius: 16px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  background: linear-gradient(180deg, #2fd160 0%, #24b04f 100%);
  color: white;
  font-weight: 1000;
  font-size: 14px;
  white-space: nowrap;
  box-shadow: 0 14px 28px rgba(34, 197, 94, 0.28), inset 0 1px 0 rgba(255, 255, 255, 0.18);
}

.addBtn:hover,
.btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 18px 34px rgba(34, 197, 94, 0.34), inset 0 1px 0 rgba(255, 255, 255, 0.18);
}

.miniBtn,
.ghostBtn {
  min-height: 38px;
  padding: 0 12px;
  border-radius: 13px;
  background: linear-gradient(180deg, #f9fafb 0%, #eef2f7 100%);
  color: #1f2937;
  font-weight: 900;
  font-size: 12px;
  border: 1px solid rgba(0, 0, 0, 0.05);
}

.miniBtn:hover,
.ghostBtn:hover,
.closeBtn:hover {
  transform: translateY(-1px);
}

.miniBtn.danger {
  background: linear-gradient(180deg, #fff1f2 0%, #ffe4e6 100%);
  color: #b91c1c;
}

.closeBtn {
  width: 42px;
  height: 42px;
  flex: 0 0 42px;
  border-radius: 14px;
  background: rgba(255, 255, 255, 0.7);
  color: #4b5563;
  font-size: 28px;
  line-height: 1;
}

.counter,
.pill,
.miniTag {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 32px;
  padding: 0 11px;
  border-radius: 999px;
  font-weight: 900;
  font-size: 11px;
}

.counter {
  background: #f3f4f6;
  color: #374151;
  min-height: 36px;
  flex-shrink: 0;
}

.pill.primary {
  background: #dbeafe;
  color: #1d4ed8;
}

.pill.success {
  background: #dcfce7;
  color: #166534;
}

.miniTag {
  background: #f4f4f5;
  color: #52525b;
  min-height: 28px;
}

.addressPreview,
.shippingItem {
  margin-top: 16px;
  border: 1px solid #e5e7eb;
  border-radius: 18px;
  background: linear-gradient(180deg, #ffffff 0%, #fcfcfd 100%);
  padding: 16px;
}

.addressPreview h4,
.shippingItem h4 {
  margin: 0 0 6px;
  color: #111827;
  font-size: 18px;
  font-weight: 1000;
  line-height: 1.15;
}

.addressPreview p,
.shippingBody p,
.recipient {
  margin: 3px 0;
  color: #4b5563;
  line-height: 1.45;
  font-weight: 700;
  font-size: 14px;
}

.recipient {
  color: #111827;
}

.preline {
  white-space: pre-line;
  word-break: break-word;
}

.shippingList {
  display: grid;
  gap: 12px;
  margin-top: 16px;
}

.shippingItem.active {
  border-color: rgba(34, 197, 94, 0.4);
  box-shadow: 0 10px 22px rgba(34, 197, 94, 0.12);
}

.shippingMeta {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 10px;
}

.shippingBody {
  margin: 12px 0 14px;
}

.notesText {
  font-size: 13px;
  color: #6b7280;
}

.shippingActions {
  flex-wrap: wrap;
  justify-content: flex-start;
  gap: 8px;
}

.form,
.modalForm {
  position: relative;
  z-index: 1;
  margin-top: 16px;
  display: grid;
  gap: 12px;
}

.modalForm {
  grid-template-columns: repeat(2, minmax(0, 1fr));
}

.modalFormLarge {
  grid-template-columns: repeat(6, minmax(0, 1fr));
  gap: 14px;
}

.field {
  min-width: 0;
}

.field.full {
  grid-column: 1 / -1;
}

.field.half {
  grid-column: span 3;
}

.field.third {
  grid-column: span 2;
}

.field label {
  display: block;
  font-size: 12px;
  font-weight: 1000;
  color: #374151;
  margin-bottom: 7px;
}

.field input,
.field textarea,
.field select {
  width: 100%;
  padding: 14px 15px;
  border-radius: 14px;
  border: 1px solid #e5e7eb;
  outline: none;
  font-size: 16px;
  font-weight: 700;
  color: #111827;
  background: linear-gradient(180deg, #ffffff 0%, #fcfcfd 100%);
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.8);
  transition: border-color 0.16s ease, box-shadow 0.16s ease, transform 0.16s ease;
}

.field select:disabled {
  cursor: not-allowed;
  background: #f3f4f6;
  color: #9ca3af;
}

.field textarea {
  resize: vertical;
  min-height: 110px;
}

.field input::placeholder,
.field textarea::placeholder {
  color: #9ca3af;
  font-weight: 600;
}

.field select {
  font-weight: 700;
}

.field input:focus,
.field textarea:focus,
.field select:focus {
  border-color: rgba(34, 197, 94, 0.55);
  box-shadow:
    0 0 0 4px rgba(34, 197, 94, 0.12),
    inset 0 1px 0 rgba(255, 255, 255, 0.8);
}

.checkRow {
  grid-column: 1 / -1;
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 13px;
  font-weight: 900;
  color: #374151;
}

.checkRow input {
  width: 18px;
  height: 18px;
  flex: 0 0 18px;
}

.btn {
  margin-top: 4px;
  width: 100%;
  min-height: 48px;
  border-radius: 16px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  background: linear-gradient(180deg, #2fd160 0%, #24b04f 100%);
  color: white;
  font-weight: 1000;
  font-size: 15px;
  box-shadow:
    0 14px 28px rgba(34, 197, 94, 0.28),
    inset 0 1px 0 rgba(255, 255, 255, 0.18);
}

.submitBtn {
  margin-top: 0;
  width: auto;
  min-width: 220px;
}

.ghostBtn {
  background: white;
}

.modalActions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 4px;
}

.spinner {
  width: 17px;
  height: 17px;
  border-radius: 50%;
  border: 2px solid rgba(255, 255, 255, 0.42);
  border-top-color: white;
  animation: spin 0.7s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.modalOverlay {
  position: fixed;
  inset: 0;
  z-index: 99999;
  background: rgba(17, 24, 39, 0.45);
  backdrop-filter: blur(5px);
  display: grid;
  place-items: center;
  padding: 14px;
}

.modalCard {
  width: 100%;
  max-width: 720px;
  padding: 20px;
  max-height: min(92vh, 860px);
  overflow: auto;
}

.modalCardBig {
  width: min(860px, calc(100vw - 32px));
  max-width: 860px;
  background: #f7efc9;
  border: 1px solid rgba(120, 113, 108, 0.18);
}

.modalHeadTop {
  align-items: flex-start;
}

.emptyState {
  margin-top: 16px;
  border: 1px dashed #d1d5db;
  border-radius: 18px;
  padding: 18px;
  color: #6b7280;
  font-weight: 800;
  display: grid;
  gap: 5px;
  text-align: center;
  font-size: 14px;
}

.globalMsg {
  margin: 14px auto 0;
  max-width: 1160px;
}

.ok,
.err {
  padding: 11px 13px;
  border-radius: 14px;
  font-weight: 900;
  font-size: 13px;
}

.ok {
  color: #166534;
  background: #ecfdf5;
  border: 1px solid #bbf7d0;
}

.err {
  color: #991b1b;
  background: #fff1f2;
  border: 1px solid #fecaca;
}

@media (min-width: 900px) {
  .page {
    padding-top: 18px;
    padding-bottom: 20px;
  }

  .hero-card,
  .address-card,
  .modalCard {
    padding: 24px;
  }

  .headText h2 {
    font-size: 34px;
  }
}

@media (max-width: 900px) {
  .page {
    padding: 12px;
    padding-top: 0;
  }

  .address-grid {
    grid-template-columns: 1fr;
    gap: 14px;
  }

  .hero-head {
    flex-direction: column;
    align-items: stretch;
  }

  .addBtn,
  .counter {
    width: 100%;
  }

  .counter {
    justify-content: center;
  }

  .modalFormLarge {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .field.half,
  .field.third {
    grid-column: span 1;
  }
}

@media (max-width: 640px) {
  .page {
    padding: 10px;
    padding-top: 0;
  }

  .hero-card {
    margin-bottom: 12px;
  }

  .card,
  .hero-card,
  .modalCard {
    border-radius: 18px;
    padding: 14px;
  }

  .head,
  .sectionHead,
  .shippingItemHead,
  .shippingActions,
  .modalHead {
    gap: 10px;
  }

  .head-left,
  .sectionHead,
  .shippingItemHead,
  .modalHead {
    flex-direction: column;
    align-items: stretch;
  }

  .back {
    width: 40px;
    height: 40px;
    flex-basis: 40px;
    border-radius: 12px;
    font-size: 20px;
  }

  .eyebrow,
  .badge {
    font-size: 10px;
    margin-bottom: 5px;
  }

  .headText h2 {
    font-size: 22px;
    line-height: 1.08;
  }

  .sectionHead h3 {
    font-size: 18px;
    line-height: 1.15;
  }

  .muted,
  .sectionMuted {
    font-size: 12px;
    line-height: 1.4;
  }

  .addressPreview,
  .shippingItem,
  .emptyState {
    margin-top: 14px;
    padding: 13px;
    border-radius: 15px;
  }

  .addressPreview h4,
  .shippingItem h4 {
    font-size: 16px;
    margin-bottom: 5px;
  }

  .addressPreview p,
  .shippingBody p,
  .recipient {
    font-size: 13px;
    line-height: 1.4;
  }

  .shippingBody {
    margin: 10px 0 12px;
  }

  .field label {
    font-size: 11px;
    margin-bottom: 6px;
  }

  .field input,
  .field textarea,
  .field select {
    font-size: 16px;
    border-radius: 12px;
    padding: 12px 13px;
  }

  .field textarea {
    min-height: 96px;
  }

  .btn,
  .addBtn,
  .ghostBtn {
    min-height: 44px;
    border-radius: 14px;
    font-size: 14px;
  }

  .miniBtn {
    min-height: 36px;
    padding: 0 10px;
    border-radius: 12px;
    font-size: 12px;
  }

  .counter,
  .pill,
  .miniTag {
    min-height: 30px;
    font-size: 10px;
    padding: 0 10px;
  }

  .modalForm,
  .modalFormLarge {
    grid-template-columns: 1fr;
    gap: 10px;
  }

  .field.half,
  .field.full,
  .field.third,
  .checkRow {
    grid-column: 1 / -1;
  }

  .checkRow {
    font-size: 12px;
    align-items: flex-start;
  }

  .modalOverlay {
    padding: 10px;
    align-items: end;
  }

  .modalCard {
    width: 100%;
    max-height: 88vh;
    padding: 14px;
    border-radius: 18px;
  }

  .modalActions {
    flex-direction: column-reverse;
  }

  .submitBtn,
  .ghostBtn {
    width: 100%;
  }

  .globalMsg {
    margin-top: 12px;
  }

  .ok,
  .err {
    font-size: 12px;
    padding: 10px 12px;
    border-radius: 12px;
  }
}

@media (max-width: 480px) {
  .page {
    padding: 8px;
    padding-top: 0;
  }

  .hero-card,
  .address-card {
    padding: 12px;
  }

  .card,
  .hero-card,
  .modalCard {
    border-radius: 16px;
  }

  .headText h2 {
    font-size: 20px;
  }

  .sectionHead h3 {
    font-size: 16px;
  }

  .muted,
  .sectionMuted {
    font-size: 11.5px;
  }

  .addBtn,
  .btn,
  .ghostBtn {
    min-height: 42px;
    font-size: 13px;
    padding: 0 12px;
  }

  .miniBtn {
    min-height: 34px;
    font-size: 11px;
    padding: 0 9px;
  }

  .addressPreview,
  .shippingItem,
  .emptyState {
    padding: 12px;
  }

  .addressPreview h4,
  .shippingItem h4 {
    font-size: 15px;
  }

  .addressPreview p,
  .shippingBody p,
  .recipient {
    font-size: 12.5px;
  }

  .field input,
  .field textarea,
  .field select {
    padding: 11px 12px;
    border-radius: 11px;
  }

  .topGlow {
    width: 160px;
    height: 160px;
  }
}
</style>
