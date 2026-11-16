/* Edita aquí el contenido de la carta, los horarios y los datos del local. */
window.TIZA_DATA = {
  business: {
    name: "La Tiza Alcosa Cervecería",
    tagline: "Tapas, raciones y cervezas en Sevilla Este",
    address: "Av. Ciudad de Chiva s/n, Edificio Alcosa Centro, 41019 Sevilla",
    phone: "+34955225405",
    whatsappContacto: "PON_AQUÍ_MI_NÚMERO",
    instagramUrl: "",
    googleMapsUrl: "https://www.google.com/maps/place/La+Tiza+Alcosa+Cervecer%C3%ADa/@37.410058,-5.924992,17z/data=!4m7!3m6!1s0xd1268cc0793b74b:0xa05758fd6446cca9!8m2!3d37.410058!4d-5.924992!10e9!16s%2Fg%2F11bc7n_vqw?entry=ttu",
    directionsUrl: "https://www.google.com/maps/dir/?api=1&destination=La+Tiza+Alcosa+Cervecer%C3%ADa+Sevilla&destination_place_id=ChIJS7eTB8xoEg0RqcxGZP1YV6A",
    googleReviewUrl: "https://search.google.com/local/writereview?placeid=ChIJS7eTB8xoEg0RqcxGZP1YV6A",
    openingHours: [
      { days: "Lunes a viernes", hours: "08:00 – 24:00" },
      { days: "Sábados y domingos", hours: "08:30 – 24:00" }
    ]
  },
  kitchenClose: "23:30", // Hora provisional de ejemplo (24 h).
  kitchenCloseIsExample: true,
  allergens: {
    gl: "Gluten", lc: "Lácteos", hu: "Huevo", fr: "Frutos secos",
    pi: "Pescado", cr: "Crustáceos", so: "Soja", mo: "Mostaza",
    ap: "Apio", su: "Sulfitos", se: "Sésamo"
  },
  featuredDishes: ["bravas", "queso-cabra", "ensaladilla", "solomillo-px", "parrillada", "arroz-dia"],
  dishImages: {
    // Añade aquí rutas de fotos propias, por ejemplo: bravas: "images/patatas-bravas.webp".
  },
  categories: [
    {
      id: "picar", title: "Para picar", subtitle: "Algo al centro y que empiece la charla.",
      items: [
        { id: "bravas", name: "Patatas bravas", description: "Patatas doradas con salsa brava de la casa.", weight: "300 g · ejemplo", allergens: [], extras: "Salsa incluida en el precio.", example: true, prices: { tapa: 4.5, racion: 7.5 } },
        { id: "queso-cabra", name: "Queso de cabra frito con arándanos", description: "Bocados crujientes con un toque dulce de arándanos.", weight: "6 unidades · ejemplo", allergens: ["gl", "lc"], extras: "Arándanos incluidos en el precio.", example: true, prices: { tapa: 5, racion: 8.5 } },
        { id: "ensaladilla", name: "Ensaladilla", description: "Una clásica para compartir, cremosa y fresquita.", weight: "250 g · ejemplo", allergens: ["hu", "pi"], extras: "Picos incluidos en el precio.", example: true, prices: { tapa: 4, racion: 7 } }
      ]
    },
    {
      id: "carnes", title: "Carnes", subtitle: "Platos para disfrutar sin mirar el reloj.",
      items: [
        { id: "solomillo-px", name: "Solomillo con salsa Pedro Ximénez", description: "Solomillo tierno con salsa de Pedro Ximénez.", weight: "200 g · ejemplo", allergens: ["su"], extras: "Guarnición incluida en el precio.", example: true, prices: { tapa: 7, racion: 12.5 } },
        { id: "solomillo-roquefort", name: "Solomillo al roquefort", description: "Solomillo acompañado de salsa cremosa al roquefort.", weight: "200 g · ejemplo", allergens: ["lc"], extras: "Guarnición incluida en el precio.", example: true, prices: { tapa: 7, racion: 12.5 } },
        { id: "parrillada", name: "Parrillada de carne con mojo picón", description: "Selección de carnes a la parrilla para compartir.", weight: "500 g · ejemplo", allergens: ["su"], extras: "Mojo picón incluido en el precio.", example: true, prices: { tapa: null, racion: 19 } }
      ]
    },
    {
      id: "cuchara", title: "Caracoles, arroces y platos del día", subtitle: "Consulta disponibilidad en sala.",
      items: [
        { id: "caracoles", name: "Caracoles", description: "Receta y disponibilidad pendientes de confirmar.", weight: "Ración · ejemplo", allergens: ["ap"], extras: "", example: true, prices: { tapa: 5, racion: 9 } },
        { id: "arroz-dia", name: "Arroz del día", description: "Pregunta al personal por la variedad de hoy.", weight: "Ración · ejemplo", allergens: [], extras: "", example: true, prices: { tapa: null, racion: 12 } },
        { id: "plato-dia", name: "Plato del día", description: "Contenido pendiente de confirmar cada jornada.", weight: "Consultar", allergens: [], extras: "", example: true, prices: { tapa: null, racion: null } }
      ]
    },
    {
      id: "montaditos", title: "Bocadillos y montaditos", subtitle: "Un bocado rápido, recién preparado.",
      items: [
        { id: "bocadillo", name: "Bocadillo del día", description: "Relleno y disponibilidad pendientes de confirmar.", weight: "Ejemplo", allergens: ["gl"], extras: "", example: true, prices: { tapa: null, racion: 6.5 } },
        { id: "montadito", name: "Montadito", description: "Pregunta por las opciones disponibles.", weight: "1 unidad · ejemplo", allergens: ["gl"], extras: "", example: true, prices: { tapa: 2.5, racion: null } }
      ]
    },
    {
      id: "bebidas", title: "Bebidas", subtitle: "Marcas y formatos pendientes de confirmar.",
      items: [
        { id: "cerveza", name: "Cerveza", description: "Marca pendiente de confirmar.", weight: "Tamaño pendiente · ejemplo", allergens: ["gl"], extras: "", example: true, prices: { tapa: 2.2, racion: null }, sizeLabel: "vaso" },
        { id: "refresco", name: "Refresco", description: "Marca pendiente de confirmar.", weight: "Tamaño pendiente · ejemplo", allergens: [], extras: "", example: true, prices: { tapa: 2.2, racion: null }, sizeLabel: "unidad" },
        { id: "agua", name: "Agua", description: "Formato pendiente de confirmar.", weight: "Tamaño pendiente · ejemplo", allergens: [], extras: "", example: true, prices: { tapa: 1.8, racion: null }, sizeLabel: "unidad" }
      ]
    }
  ],
  zones: [
    { name: "Terraza", description: "Aire libre para disfrutar de la sobremesa.", visual: "terraza" },
    { name: "Salón", description: "Un espacio cómodo para reunirse y compartir.", visual: "salon" },
    { name: "Terraza interior", description: "Un rincón resguardado en la parte de atrás.", visual: "interior" }
  ]
};
