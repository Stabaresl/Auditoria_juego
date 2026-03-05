// ═══════════════════════════════════════════════════════
//  DATOS DEL JUEGO — El Concepto Infiltrado
//  Basado en: Valencia, Marulanda y López (2016)
//  "Aseguramiento y auditoría de TI orientados a riesgos"
//  v3.0 — Banco revisado y validado contra el texto fuente
// ═══════════════════════════════════════════════════════
//
//  CRITERIOS DE REVISIÓN:
//  ✅ Definiciones extraídas o parafraseadas del libro
//  ✅ Conceptos FALSOS: plausibles, técnicos, difíciles de detectar
//  ✅ Conceptos REALES: completos, sin pistas que delaten al falso
//  ✅ Al menos 1 falso por ronda (puede haber 2 en rondas grandes)
// ═══════════════════════════════════════════════════════

export const CHAPTERS = [

  // ══════════════════════════════════════════════════════
  //  CAPÍTULO 1 — Aseguramiento Organizacional y Tecnológico
  // ══════════════════════════════════════════════════════
  {
    id: 'aseguramiento-cap1',
    num: '01',
    name: 'Aseguramiento Organizacional y Tecnológico',
    description: 'Marcos, líneas de defensa, GRC y campos de actuación en TI',
    rounds: [

      // ── Ronda 1 ─────────────────────────────────────
      {
        id: 'r1-triada-aseg',
        topic: 'La Tríada del Aseguramiento',
        concepts: [
          {
            id: 'aseguramiento',
            name: 'Aseguramiento',
            definition: 'Función organizacional diseñada para mejorar el grado de confianza que se tiene sobre un asunto en particular. Según el Instituto de Auditores Internos (IAA), es aquella función que provee aseguramiento sobre la efectividad del gobierno, administración de riesgos y control.',
            fake: false,
          },
          {
            id: 'riesgo',
            name: 'Riesgo',
            definition: 'Término asociado a la incertidumbre sobre un aspecto específico. Como sistema de gestión, utiliza técnicas para identificar, analizar, valorar, definir medidas de mitigación, comunicar y monitorear los diferentes eventos negativos o positivos que pueden impactar en el cumplimiento de los objetivos de una organización dentro de un contexto específico.',
            fake: false,
          },
          {
            id: 'control',
            name: 'Control',
            definition: 'Segunda disciplina interdependiente dentro de la tríada del aseguramiento. Comprende las medidas, políticas y procedimientos que una organización implementa para mitigar los riesgos identificados y garantizar el cumplimiento de sus objetivos estratégicos y operativos.',
            fake: false,
          },
          {
            id: 'auditoria',
            name: 'Auditoría',
            definition: 'Tercera disciplina de la tríada del aseguramiento. Función independiente y objetiva que recolecta y evalúa evidencia suficiente y pertinente para determinar si los controles que mitigan los riesgos identificados funcionan de manera eficaz y eficiente.',
            fake: false,
          },
          {
            id: 'gobierno-corporativo',
            name: 'Gobierno Corporativo',
            definition: 'Sistema a través del cual las empresas son dirigidas y controladas para lograr los objetivos previstos. Es uno de los tres conceptos centrales del marco GRC según el OCEG, junto con la gestión de riesgos y el cumplimiento normativo.',
            fake: false,
          },
          {
            id: 'aseguramiento-pleno',
            name: 'Aseguramiento Pleno (Full Assurance)',
            definition: 'Nivel superior del modelo de madurez del aseguramiento definido por el IIA Global en 2013, en el que las tres disciplinas —riesgo, control y auditoría— operan con procesos integrados, métricas compartidas y reporte unificado ante el consejo directivo, eliminando toda duplicación de esfuerzos.',
            fake: true,
          },
        ],
      },

      // ── Ronda 2 ─────────────────────────────────────
      {
        id: 'r1-marcos-grc',
        topic: 'Marcos de Aseguramiento: GRC y sus Conceptos',
        concepts: [
          {
            id: 'grc-marco',
            name: 'Gobierno, Riesgo y Cumplimiento (GRC)',
            definition: 'Marco de referencia emitido en 2008 por el OCEG (Open Compliance and Ethics Group) que integra conceptualmente el gobierno corporativo, la gestión de riesgos y las funciones de cumplimiento. Promueve la unificación de criterios, la coordinación de esfuerzos y la colaboración entre los responsables de la dirección organizacional.',
            fake: false,
          },
          {
            id: 'cumplimiento',
            name: 'Cumplimiento',
            definition: 'Todos los compromisos internos y externos —por lo general obligatorios— que debe cumplir una organización en el desarrollo de su misión. Estos compromisos pueden estar asociados a requerimientos regulatorios, políticas internas y externas, acuerdos con proveedores, entre otros.',
            fake: false,
          },
          {
            id: 'it-grc',
            name: 'Gobierno, Riesgo y Cumplimiento de TI (IT GRC)',
            definition: 'Subconjunto del GRC corporativo compuesto por tres cuerpos de conocimiento integrados: el gobierno de TIC (IT governance), los riesgos de TIC (IT risk) y el cumplimiento regulatorio y normativo de TIC (IT compliance), que actúan de forma integrada.',
            fake: false,
          },
          {
            id: 'oceg',
            name: 'Grupo Abierto de Cumplimiento y Ética (OCEG)',
            definition: 'Open Compliance and Ethics Group. Organización que emitió el marco GRC en 2008, a través del cual se promueve la unificación de criterios, la coordinación de esfuerzos y la colaboración entre los responsables de la dirección de la organización, mediante la integración de los órganos responsables del gobierno, administración de riesgos, control interno y cumplimiento.',
            fake: false,
          },
          {
            id: 'gobierno-tic',
            name: 'Gobierno Corporativo de TIC',
            definition: 'Definido por el ITGI (IT Governance Institute) como responsabilidad del comité de dirección y de los ejecutivos. Es una parte integral del gobierno de la organización y consiste en el liderazgo, la estructura y los procesos organizativos que aseguran que las TIC sostengan y extiendan la estrategia y los objetivos de la organización.',
            fake: false,
          },
          {
            id: 'cumplimiento-tic',
            name: 'Cumplimiento Normativo y Regulatorio de TIC',
            definition: 'Equivale a las diferentes normas y regulaciones, tanto internas como externas, que debe cumplir el área de tecnologías de información. Incluye regulaciones como la ley de habeas data, leyes de derechos de autor, ley de propiedad de datos y normas específicas como ISO/IEC 20000, ISO/IEC 27001, ISO/IEC 12207 e ISO/IEC 29110.',
            fake: false,
          },
          {
            id: 'grc-wheel',
            name: 'Marco de Cumplimiento Circular GRC (GRC Wheel)',
            definition: 'Extensión del modelo GRC publicada por el OCEG en 2011 que organiza los procesos de gobierno, riesgo y cumplimiento en un ciclo de cuatro fases —Lograr, Evaluar, Prevenir y Promover— para que las organizaciones alcancen de forma dinámica sus objetivos con integridad.',
            fake: true,
          },
        ],
      },

      // ── Ronda 3 ─────────────────────────────────────
      {
        id: 'r1-lineas-defensa',
        topic: 'Modelo de Tres Líneas de Defensa (3LoD)',
        concepts: [
          {
            id: '3lod',
            name: 'Modelo de Tres Líneas de Defensa (3LoD)',
            definition: 'Modelo establecido por el IIA Global en 2013 mediante una "declaración de posición", con el fin de establecer roles específicos alrededor de los temas de riesgo, control y auditoría, y coordinar las acciones llevadas a cabo por los diferentes grupos de interés relacionados con el aseguramiento organizacional.',
            fake: false,
          },
          {
            id: 'primera-linea',
            name: 'Primera Línea de Defensa',
            definition: 'Asumida por la gerencia en sus diferentes niveles (gerencia general y gerencias operativas), así como la función de control interno, ya sea que se encuentre de manera explícita o implícita como parte de un modelo de control interno. Gestiona los riesgos en el día a día de la operación.',
            fake: false,
          },
          {
            id: 'segunda-linea',
            name: 'Segunda Línea de Defensa',
            definition: 'Conformada por las áreas especializadas que ejercen diferentes funciones de control y aseguramiento en la organización: controles financieros, seguridad, gestión de riesgos, calidad, inspección y cumplimiento. En el contexto TIC, corresponde a los controles ejercidos por áreas especializadas, responsables de protección de datos, áreas de cumplimiento tecnológico y funciones de seguridad de la información.',
            fake: false,
          },
          {
            id: 'tercera-linea',
            name: 'Tercera Línea de Defensa',
            definition: 'La auditoría interna. Actúa de forma independiente y objetiva, en concordancia con las normas internacionales de auditoría interna, y reporta a los diferentes organismos de gobierno corporativo. En el contexto TIC, corresponde a la auditoría de tecnologías de información.',
            fake: false,
          },
          {
            id: 'cuarta-linea',
            name: 'Cuarta Línea de Defensa (Organismos Externos)',
            definition: 'Considerada por algunos autores como una extensión del modelo. Corresponde a las funciones externas de control ejercidas por organismos públicos como las contralorías o los organismos sectoriales de control, y por organizaciones privadas que desarrollan funciones de revisoría fiscal o auditoría de tercera parte.',
            fake: false,
          },
          {
            id: 'linea-cero',
            name: 'Línea Cero de Defensa (L0D)',
            definition: 'Concepto propuesto por el IIA en su actualización del modelo 3LoD en 2020, que reconoce a los usuarios finales y ciudadanos como primera barrera informal de detección de fraudes y anomalías operativas, situados antes de la gerencia en el esquema de aseguramiento organizacional.',
            fake: true,
          },
        ],
      },

      // ── Ronda 4 ─────────────────────────────────────
      {
        id: 'r1-aseg-combinado',
        topic: 'Aseguramiento Combinado y Mapas de Aseguramiento',
        concepts: [
          {
            id: 'aseg-combinado',
            name: 'Aseguramiento Combinado',
            definition: 'Alternativa para disminuir el problema de fragmentación de informes y aportar a la integración de la información de aseguramiento, pues la alta gerencia y los diferentes órganos de gobierno reciben de forma aislada diversos informes de los diferentes actores internos y externos, lo que puede generar un desgaste y frustración al no poder visualizar de forma integrada el estado actual del aseguramiento.',
            fake: false,
          },
          {
            id: 'mapa-aseguramiento',
            name: 'Mapa de Aseguramiento',
            definition: 'Herramienta diseñada con el fin de establecer una adecuada coordinación de los diferentes actores internos y externos relacionados con la función de aseguramiento en una organización, y de esta forma minimizar la duplicación de esfuerzos y dar una cobertura adecuada a las diferentes tareas relacionadas con el riesgo, el control y la auditoría.',
            fake: false,
          },
          {
            id: 'iia-2050',
            name: 'Estándar de Coordinación IIA 2050',
            definition: 'Estándar de auditoría internacional del IIA relacionado con la coordinación. Establece que el director ejecutivo de auditoría debe compartir información y coordinar actividades con otros proveedores internos y externos de aseguramiento y de servicios de consultoría relevantes para asegurar una cobertura adecuada y minimizar la duplicidad de esfuerzos.',
            fake: false,
          },
          {
            id: 'cbok-voice',
            name: 'Documento CBOK "Una voz, una visión" (Combined Assurance)',
            definition: 'Documento del Common Body of Knowledge del IIA Global titulado "Combined assurance: One language, one voice, one view", que planteó el aseguramiento combinado como alternativa para resolver el problema de alineamiento e integración de las diferentes funciones y organismos de aseguramiento de una organización.',
            fake: false,
          },
          {
            id: 'auditoria-integrada',
            name: 'Auditorías Integradas',
            definition: 'Una de las formas de coordinar el aseguramiento combinado propuestas por Huibers (2015). Se logra a través del desarrollo de auditorías conjuntas con funciones de soporte (por ejemplo, de calidad) o auditores externos.',
            fake: false,
          },
          {
            id: 'integracion-funcional',
            name: 'Integración Funcional',
            definition: 'Forma de coordinación del aseguramiento combinado que consiste en integrar áreas o funciones que desarrollan labores de aseguramiento, como la integración de las áreas de calidad con las áreas de control interno.',
            fake: false,
          },
          {
            id: 'integracion-procesos',
            name: 'Integración de Procesos',
            definition: 'Forma de coordinar el aseguramiento combinado mediante la presentación de reportes conjuntos entre diferentes actores alrededor de un proceso de control específico o utilizando los esquemas de auditoría orientada a riesgos, donde un riesgo es evaluado por diferentes actores (por ejemplo, auditorías financieras y revisoría fiscal).',
            fake: false,
          },
          {
            id: 'alineacion-actividades',
            name: 'Alineación a través de Actividades',
            definition: 'Forma de coordinar el aseguramiento combinado de manera estructurada o ad hoc; por ejemplo, al momento de llevar a cabo auditorías se puede revisar el estado de la actualización de riesgos, o las acciones que han sido recomendadas por otros actores del aseguramiento como contralorías o revisoría fiscal.',
            fake: false,
          },
          {
            id: 'consejo-2050-2',
            name: 'Consejo para la Práctica 2050-2 del IIA',
            definition: 'Orientado a establecer mapas de aseguramiento. Considera la existencia de tres clases de proveedores de servicios de aseguramiento: los que informan a la alta dirección o son parte de ella, los que informan al consejo (incluida la auditoría interna) y los que informan a las personas interesadas externas.',
            fake: false,
          },
          {
            id: 'pad-dual',
            name: 'Protocolo de Aseguramiento Dual (PAD)',
            definition: 'Mecanismo propuesto por el IIA en 2016 que formaliza la coordinación simultánea entre auditoría interna y revisoría fiscal para la evaluación conjunta de controles clave, evitando la duplicidad de pruebas sustantivas y reduciendo el tiempo total de ejecución en un ciclo de aseguramiento.',
            fake: true,
          },
        ],
      },

      // ── Ronda 5 ─────────────────────────────────────
      {
        id: 'r1-perfiles',
        topic: 'Perfiles Funcionales del Aseguramiento',
        concepts: [
          {
            id: 'cro',
            name: 'Director de Riesgos Organizacional (CRO / CRMO)',
            definition: 'Chief Risk Officer o Chief Risk Management Officer. Perfil a nivel organizacional responsable de la disciplina de riesgos dentro del aseguramiento corporativo.',
            fake: false,
          },
          {
            id: 'cso',
            name: 'Director de Seguridad Organizacional (CSO)',
            definition: 'Chief Security Officer. Perfil a nivel organizacional responsable de la disciplina de control dentro del aseguramiento corporativo, junto con el CICO (Chief Internal Control Officer).',
            fake: false,
          },
          {
            id: 'cao',
            name: 'Director Ejecutivo de Auditoría (CAO / CAE)',
            definition: 'Chief Audit Officer o Chief Audit Executive. Perfil a nivel organizacional responsable de la disciplina de auditoría dentro del aseguramiento corporativo.',
            fake: false,
          },
          {
            id: 'ciro',
            name: 'Director de Riesgos de Información (CIRO)',
            definition: 'Chief Information Risk Officer. Perfil a nivel tecnológico responsable de la gestión de riesgos de TIC dentro del aseguramiento tecnológico.',
            fake: false,
          },
          {
            id: 'ciso',
            name: 'Director de Seguridad de la Información (CISO)',
            definition: 'Chief Information Security Officer. Perfil a nivel tecnológico responsable de la disciplina de control en el contexto del aseguramiento tecnológico.',
            fake: false,
          },
          {
            id: 'cisa-perfil',
            name: 'Auditor de Sistemas de Información (CISA)',
            definition: 'Chief Information System Auditor. Perfil a nivel tecnológico responsable de la disciplina de auditoría dentro del aseguramiento tecnológico. La sigla CISA se refiere con mayor frecuencia a Certified Information System Auditor, certificación internacional de ISACA.',
            fake: false,
          },
          {
            id: 'ciao-falso',
            name: 'Director de Aseguramiento e Innovación (CIAO)',
            definition: 'Chief Innovation and Assurance Officer. Perfil emergente definido por el IIA en colaboración con el OCEG en 2019, que fusiona las responsabilidades del CAE con el liderazgo de iniciativas de transformación digital y gestión de riesgos emergentes en organizaciones de alta madurez tecnológica.',
            fake: true,
          },
        ],
      },

      // ── Ronda 6 ─────────────────────────────────────
      {
        id: 'r1-campos-actuacion',
        topic: 'Campos de Actuación del Aseguramiento Tecnológico',
        concepts: [
          {
            id: 'control-interno-tec',
            name: 'Control Interno Tecnológico (Control Interno Informático)',
            definition: 'Sistema de control cuyo objetivo es verificar diariamente que todas las actividades de los sistemas de información sean realizadas cumpliendo los procedimientos, estándares y normas fijadas por la organización o el área informática (Piattini y Del Peso, 1998). El modelo más representativo a nivel mundial es COBIT (Control Objectives for Information and Related Technologies).',
            fake: false,
          },
          {
            id: 'sgsi',
            name: 'Sistema de Gestión de Seguridad de la Información (SGSI / ISO 27001)',
            definition: 'La norma ISO/IEC 27001 establece un sistema de gestión de seguridad de la información que hace parte de los procesos y de la estructura de gestión total de la información de la organización. A través de este sistema se preserva la confidencialidad, la integridad y la disponibilidad de la información mediante la aplicación de un proceso de gestión del riesgo.',
            fake: false,
          },
          {
            id: 'seg-informatica',
            name: 'Seguridad Informática',
            definition: 'Conjunto de procedimientos, dispositivos y herramientas encargadas de asegurar la integridad, disponibilidad y privacidad de la información en un sistema informático e intenta reducir las amenazas que pueden afectar el mismo (García, Hurtado y Alegre, 2011). A diferencia del SGSI, se centra en los activos tecnológicos más que en la información como concepto.',
            fake: false,
          },
          {
            id: 'comp-forense',
            name: 'Computación Forense',
            definition: 'Disciplina de las ciencias forenses que, considerando las tareas propias asociadas con la evidencia, procura descubrir e interpretar la información en los medios informáticos para establecer los hechos y formular las hipótesis relacionadas con el caso (Cano, 2009). Utiliza métodos científicos para preservar, recolectar, validar, identificar, analizar, interpretar, documentar y presentar evidencias digitales.',
            fake: false,
          },
          {
            id: 'auditoria-sistemas',
            name: 'Auditoría de Sistemas (IT Assurance)',
            definition: 'Función de aseguramiento a través de la cual se recolecta y evalúa evidencia suficiente y pertinente con el fin de determinar si los controles que mitigan los diferentes riesgos asociados a las tecnologías de información y comunicaciones son eficaces y eficientes para proteger adecuadamente el cumplimiento de los objetivos y metas organizacionales.',
            fake: false,
          },
          {
            id: 'gestion-riesgos-tic',
            name: 'Gestión de Riesgos de TIC',
            definition: 'Proceso mediante el cual se identifican, analizan, evalúan y definen los planes de tratamiento de todos aquellos eventos adversos (amenazas) que pueden llegar a impactar los recursos tecnológicos o la información de una organización. Es una de las funciones esenciales del gobierno de tecnologías de información según Saleh y Alfantookh (2011).',
            fake: false,
          },
          {
            id: 'auditoria-continua-falso',
            name: 'Auditoría Continua Automatizada (ACA)',
            definition: 'Campo emergente del aseguramiento tecnológico que usa agentes de software integrados en los sistemas transaccionales para ejecutar pruebas de cumplimiento en tiempo real y emitir alertas automáticas al director ejecutivo de auditoría, reduciendo el ciclo tradicional de planeación-ejecución-reporte a un modelo de monitoreo perpetuo.',
            fake: true,
          },
        ],
      },

      // ── Ronda 7 ─────────────────────────────────────
      {
        id: 'r1-cobit5-aseg',
        topic: 'COBIT 5 para Aseguramiento: Los 5 Componentes',
        concepts: [
          {
            id: 'parte-responsable',
            name: 'Parte Responsable (Componente 1)',
            definition: 'Primer componente de una iniciativa de aseguramiento TIC según COBIT 5. Es la entidad o área auditada que gobierna y gestiona el asunto sobre el que se va a proporcionar aseguramiento.',
            fake: false,
          },
          {
            id: 'asunto-auditoria',
            name: 'El Asunto (Componente 2)',
            definition: 'Segundo componente de la iniciativa de aseguramiento. Equivale al objeto de análisis de la auditoría, el cual puede incluir la infraestructura tecnológica, las aplicaciones de negocio y las prácticas de gobierno y gestión de tecnologías de información.',
            fake: false,
          },
          {
            id: 'criterios-adecuados',
            name: 'Criterios Adecuados (Componente 3)',
            definition: 'Tercer componente. Son los parámetros contra los que se confronta la evidencia obtenida en el proceso de auditoría. Están basados en mejores prácticas o en las políticas, procedimientos y prácticas establecidas formalmente en la organización que es objeto de estudio.',
            fake: false,
          },
          {
            id: 'ejecucion-auditoria',
            name: 'Ejecución de la Auditoría (Componente 4)',
            definition: 'Cuarto componente. Incorpora las pruebas sustantivas y de cumplimiento necesarias para evaluar el nivel de conformidad de los criterios de auditoría establecidos previamente.',
            fake: false,
          },
          {
            id: 'conclusion-auditoria',
            name: 'Conclusión de la Auditoría (Componente 5)',
            definition: 'Quinto y último componente. Se realiza formalmente a través de una comunicación que contiene los hallazgos y recomendaciones que se hacen a partir del análisis proporcionado por la evidencia obtenida.',
            fake: false,
          },
          {
            id: 'usuario-secundario',
            name: 'El Usuario (Parte Secundaria en el Modelo)',
            definition: 'En el modelo de iniciativa de aseguramiento de COBIT 5, el usuario es la instancia secundaria que requiere la auditoría y a la cual, por lo general, se le notifica el informe. Se diferencia de la parte responsable, que es el área auditada, y del profesional de aseguramiento, que ejecuta el proceso.',
            fake: false,
          },
          {
            id: 'alcance-dinamico-falso',
            name: 'Alcance Dinámico de la Iniciativa (Componente Transversal)',
            definition: 'Componente transversal de la guía COBIT 5 para aseguramiento que permite al profesional de auditoría ampliar o reducir el alcance de la iniciativa durante la ejecución, en función de los hallazgos preliminares, sin necesidad de replantear los criterios adecuados ya establecidos.',
            fake: true,
          },
        ],
      },

      // ── Ronda 8 ─────────────────────────────────────
      {
        id: 'r1-vision-integrada',
        topic: 'Visión Integrada del Aseguramiento Organizacional y Tecnológico',
        concepts: [
          {
            id: 'tic-recurso-vital',
            name: 'Las TIC como Recurso Vital (no como fin)',
            definition: 'Postura central del libro: las TIC son un medio y no un fin en sí mismo, un medio para gestionar adecuadamente la información que requiere la organización para tomar las decisiones que soportan las diferentes estrategias de negocio y su operación en general.',
            fake: false,
          },
          {
            id: 'ciclo-auditoria',
            name: 'Ciclo General de Auditoría y Aseguramiento',
            definition: 'Proceso que va desde la planeación, con sus diferentes subfases, hasta el seguimiento, a través del cual se asegura que las recomendaciones u opciones de mejora establecidas en un informe de auditoría se cumplan a cabalidad y de esta forma se lleve el riesgo empresarial y tecnológico a un nivel aceptable por la organización.',
            fake: false,
          },
          {
            id: 'auditoria-control-controles',
            name: 'La Auditoría como "Control de Controles"',
            definition: 'Sentencia difundida en la literatura académica y profesional: la auditoría moderna, sea empresarial o tecnológica, se basa en riesgos, y los riesgos, para llevarlos a un nivel aceptable, requieren controles; es necesario evaluar dichos controles para garantizar su eficacia y eficiencia.',
            fake: false,
          },
          {
            id: 'alineacion-aseg',
            name: 'Alineación entre Aseguramiento Empresarial y Tecnológico',
            definition: 'Principio que establece que cualquier evento adverso de los procesos y recursos de TIC o de la información afectará los procesos, recursos y estrategias del negocio, y como consecuencia el cumplimiento de sus objetivos. Por ello debe existir alineación entre el aseguramiento empresarial y el aseguramiento tecnológico.',
            fake: false,
          },
          {
            id: 'iso38500-referente',
            name: 'ISO/IEC 38500:2008 como Referente de Gobierno TIC',
            definition: 'Norma que proporciona un marco de principios para que los directores los utilicen en la evaluación, la dirección, el monitoreo y el uso de la tecnología de la información en sus organizaciones. Es uno de los dos principales referentes del gobierno corporativo de TIC, junto a COBIT 5.0.',
            fake: false,
          },
          {
            id: 'modelo-capas-12',
            name: 'Modelo de 12 Capas Tecnológicas (Valencia, Marulanda y López, 2015)',
            definition: 'Modelo compuesto por 12 capas tecnológicas interdependientes y organizadas de forma tal que, en caso de que se presente una falla en alguna de ellas, puede generarse un efecto dominó sobre las demás, lo que lleva a contemplar una gestión de riesgos integral. Las capas van desde los procesos de negocio (capa 1) hasta los sistemas de energía (capa 12).',
            fake: false,
          },
          {
            id: 'modelo-madurez-aseg-falso',
            name: 'Modelo de Madurez del Aseguramiento Integrado (MMAI)',
            definition: 'Herramienta de autoevaluación propuesta en el libro para que las organizaciones midan el nivel de integración de sus tres disciplinas de aseguramiento en una escala de 1 a 5, donde el nivel 5 corresponde a un aseguramiento combinado con mapas dinámicos actualizados en tiempo real.',
            fake: true,
          },
        ],
      },

    ], // fin rounds cap 1

    glossary: [
      {
        term: 'Aseguramiento',
        definition: 'Función organizacional diseñada para mejorar el grado de confianza sobre un asunto particular. Integra tres elementos interdependientes: riesgo, control y auditoría (Tríada del Aseguramiento). Distintos actores lo proveen: autoevaluación, auditoría interna y auditoría externa.',
        example: 'El área de auditoría interna de un banco da "aseguramiento" al consejo directivo de que los controles de ciberseguridad funcionan y el riesgo está en niveles aceptables.',
      },
      {
        term: 'GRC (Governance, Risk and Compliance)',
        definition: 'Marco de referencia emitido en 2008 por el OCEG. Integra gobierno corporativo, gestión de riesgos y cumplimiento normativo. Su objetivo es unificar criterios, coordinar esfuerzos y establecer canales de comunicación entre los responsables del aseguramiento.',
        example: 'Una empresa de salud usa GRC para que el área jurídica (cumplimiento), la gerencia de riesgos y la junta directiva compartan la misma visión sobre las amenazas regulatorias.',
      },
      {
        term: 'Modelo 3LoD (Three Lines of Defense)',
        definition: 'Modelo del IIA Global (2013) que asigna roles específicos en torno a riesgo, control y auditoría. Primera línea: gerencia operativa. Segunda línea: áreas especializadas. Tercera línea: auditoría interna independiente.',
        example: 'En un banco: el área de TI gestiona el acceso a sistemas (1ª), el área de seguridad supervisa los logs (2ª), y los auditores internos validan que todo funcione (3ª).',
      },
      {
        term: 'IT GRC',
        definition: 'Subconjunto del GRC corporativo aplicado al ámbito tecnológico. Integra gobierno de TIC (ISO 38500 / COBIT), riesgos de TIC y cumplimiento normativo de TIC (ISO 27001, habeas data, derechos de autor).',
        example: 'El CISO de una entidad pública implementa IT GRC para alinear su estrategia de ciberseguridad con la Ley 1581 de Habeas Data y los controles COBIT.',
      },
      {
        term: 'Aseguramiento Combinado',
        definition: 'Enfoque para integrar la información de todos los actores de aseguramiento (auditoría interna, externa, revisoría fiscal, calidad, entes gubernamentales) en una vista unificada que evite duplicación y brinde coherencia a la alta dirección.',
        example: 'En lugar de recibir 7 informes separados, la junta directiva recibe un único informe de aseguramiento combinado que muestra el estado global del riesgo y control.',
      },
      {
        term: 'Mapa de Aseguramiento',
        definition: 'Herramienta de coordinación que muestra quién asegura qué, identificando actores, riesgos cubiertos, nivel de riesgo inherente/residual y cobertura de cada proveedor de aseguramiento. Recomendado por el IIA en el consejo 2050-2.',
        example: 'El mapa muestra que el riesgo de fraude en pagos es alto (riesgo inherente), está parcialmente cubierto por auditoría interna y sin cobertura de auditoría externa: brecha identificada.',
      },
      {
        term: 'Gobierno Corporativo de TIC',
        definition: 'Definido por el ITGI como responsabilidad del comité de dirección. Asegura que las TIC sostengan la estrategia organizacional. Sus referencias principales son ISO/IEC 38500:2008 y COBIT 5.0.',
        example: 'La junta directiva aprueba la política de gobierno de TIC que establece cómo se toman decisiones sobre inversión tecnológica, arquitectura empresarial y continuidad del negocio.',
      },
      {
        term: 'Computación Forense',
        definition: 'Disciplina forense que utiliza métodos científicos para preservar, recolectar, validar, identificar, analizar, interpretar, documentar y presentar evidencias digitales, con el fin de reconstruir hechos delictivos procedentes de fuentes digitales (Cano, 2009).',
        example: 'Tras una filtración de datos, el equipo forense recupera logs del servidor, reconstruye la secuencia de accesos ilegítimos y determina qué información fue exfiltrada.',
      },
      {
        term: 'Auditoría de Sistemas (IT Assurance)',
        definition: 'Función de aseguramiento que recolecta y evalúa evidencia suficiente y pertinente para determinar si los controles que mitigan los riesgos de TIC son eficaces y eficientes. Sigue el ciclo: planeación → ejecución → reporte → seguimiento.',
        example: 'El auditor evalúa si los controles de acceso al sistema bancario core cumplen con los criterios COBIT y detecta que el 30% de los accesos privilegiados no tienen doble autenticación.',
      },
    ],
  },

  // ══════════════════════════════════════════════════════
  //  CAPÍTULO 2 — Riesgos de TIC
  // ══════════════════════════════════════════════════════
  {
    id: 'riesgos-ti',
    num: '02',
    name: 'Riesgos de Tecnologías de Información y Comunicaciones',
    description: 'Metodologías, COBIT 5.0, Tríada CIA y activos TIC',
    rounds: [

      // ── Ronda 1 ─────────────────────────────────────
      {
        id: 'r2-marcos-riesgos',
        topic: 'Marcos de Referencia para Riesgos de TIC',
        concepts: [
          {
            id: 'iso38500-riesgos',
            name: 'ISO/IEC 38500:2008 y los Riesgos de TIC',
            definition: 'Esta norma contempla los riesgos de TIC tanto en la definición de gobierno de TIC como en su estructura, si bien no de manera explícita, sí en su contexto, pues establece el control como parte de la definición, lo que en la lógica de las metodologías de gestión de riesgos conlleva la existencia de riesgos para poder definir controles.',
            fake: false,
          },
          {
            id: 'cobit41-areas',
            name: 'COBIT 4.1: Cinco Áreas de Enfoque para el Gobierno TIC',
            definition: 'Establecidas por el IT Governance Institute (ITGI) e ISACA: alineamiento estratégico, entrega de valor, administración de riesgos, administración de recursos y medición del desempeño. La administración de riesgos es entendida como un área en la que los altos ejecutivos requieren concientizarse acerca de la evolución de las amenazas, la transparencia de los riesgos significativos y el apetito del riesgo.',
            fake: false,
          },
          {
            id: 'cobit5-riesgos-perspectivas',
            name: 'COBIT 5 para Riesgos: Dos Perspectivas',
            definition: 'Guía profesional de COBIT 5 liberada en 2013. Presenta dos perspectivas: la perspectiva de la función de riesgos (elementos necesarios para construir y mantener la función de riesgos en una organización) y la perspectiva de la gestión de riesgos (procesos orientados a identificar, analizar, responder y reportar los riesgos diariamente).',
            fake: false,
          },
          {
            id: 'riesgos-funcion-esencial',
            name: 'Los Riesgos de TI como Función Esencial de Gobierno',
            definition: 'Según Saleh y Alfantookh (2011), los riesgos de tecnologías de información son una disciplina considerada una de las funciones esenciales del gobierno de tecnologías de información. Su gestión está basada en métodos que permiten planear, identificar, analizar, evaluar, tratar y monitorear los riesgos asociados con las actividades, funciones, procesos y recursos de TIC.',
            fake: false,
          },
          {
            id: 'risk-it-dominios',
            name: 'Marco RISK IT de ISACA: Tres Dominios',
            definition: 'Iniciativa de ISACA desarrollada como complemento de COBIT. Es un marco de riesgos de TIC basado en un conjunto de principios, guías, procesos de negocio y directrices conformado por tres ámbitos y nueve procesos interrelacionados: Gobierno del riesgo (RG), Evaluación del riesgo de TI (RE) y Respuesta al riesgo de TI (RR).',
            fake: false,
          },
          {
            id: 'iso31000-tic-falso',
            name: 'ISO 31000 Perfil TIC (IT Risk Profile)',
            definition: 'Anexo específico de la norma ISO 31000:2018 desarrollado por el comité ISO/TC 292 en colaboración con ISACA, que adapta el proceso general de gestión de riesgos a los activos tecnológicos y establece criterios de apetito de riesgo diferenciados para entornos de nube, IoT y sistemas de control industrial.',
            fake: true,
          },
        ],
      },

      // ── Ronda 2 ─────────────────────────────────────
      {
        id: 'r2-metodologias',
        topic: 'Metodologías de Gestión de Riesgos de TIC',
        concepts: [
          {
            id: 'nist-800-30',
            name: 'NIST 800-30',
            definition: 'Guía para la administración de riesgos de tecnologías de información del Instituto Nacional de Estándares y Tecnología (NIST) de los Estados Unidos, aplicable a todas las instituciones gubernamentales de este país y ampliamente referenciada. Plantea una estructura metodológica basada en 9 fases: caracterización del sistema, identificación de amenazas, identificación de vulnerabilidades, análisis del control, determinación de probabilidad, análisis del impacto, determinación del riesgo, recomendación de controles y documentación de resultados.',
            fake: false,
          },
          {
            id: 'magerit',
            name: 'MAGERIT (Metodología de Análisis y Gestión de Riesgos)',
            definition: 'Metodología de análisis y gestión de riesgos de los sistemas de información originada en España. Uno de los métodos más referenciados en publicaciones científicas, constituida como marco para el proceso de gestión de riesgos no solo en España sino a nivel internacional. Compuesta por tres libros: método, catálogo de elementos y guía de técnicas. Tiene como herramienta de soporte la aplicación Pilar.',
            fake: false,
          },
          {
            id: 'octave',
            name: 'OCTAVE (Operationally Critical Threat, Asset and Vulnerability Evaluation)',
            definition: 'Colección de herramientas, técnicas y métodos para evaluar los riesgos de seguridad de la información, desarrollada por el Software Engineering Institute (SEI) de Carnegie Mellon (Talabis y Martin, 2012). Cuenta con tres versiones: Octave, Octave-S y Octave Allegro, cada una con variaciones en su concepción y actividades por fase.',
            fake: false,
          },
          {
            id: 'mehari',
            name: 'MEHARI (Method for Harmonized Analysis of Risk)',
            definition: 'Método Armonizado de Gestión de Riesgos desarrollado por el CLUSIF (Club de la Seguridad de la Información de Francia) desde 1996, con el fin de asistir a diferentes ejecutivos de la organización (administradores operativos, jefes de sistemas, administradores de riesgos, auditores) en su esfuerzo para gestionar la seguridad de la información y los recursos asociados para reducir los riesgos.',
            fake: false,
          },
          {
            id: 'cramm',
            name: 'CRAMM (CCTA Risk Analysis and Management Method)',
            definition: 'Metodología del gobierno del Reino Unido para el análisis y gestión de riesgos. Estructurada en tres etapas principales: establecimiento de los objetivos de seguridad del sistema, análisis de riesgos del sistema (identificación de amenazas y vulnerabilidades), y selección y recomendación de controles de seguridad.',
            fake: false,
          },
          {
            id: 'ms-security-guide',
            name: 'The Security Risk Management Guide (Microsoft)',
            definition: 'Guía de seguridad de riesgos desarrollada por Microsoft. Compuesta por cuatro fases y trece actividades: evaluación del riesgo (planificación de recolección, recopilación de datos y priorización de riesgos), apoyo en la toma de decisiones, implementación de controles y medición de la eficacia del programa.',
            fake: false,
          },
          {
            id: 'iso27005',
            name: 'ISO/IEC 27005',
            definition: 'Norma publicada en 2008 que forma parte de la familia ISO 27000. Proporciona directrices para la gestión de riesgos de tecnologías de información y da soporte de manera particular a la norma ISO/IEC 27001:2013 del sistema de gestión de seguridad de la información. Su estructura es muy similar a la ISO 31000.',
            fake: false,
          },
          {
            id: 'ebios-falso',
            name: 'EBIOS (Expression des Besoins et Identification des Objectifs de Sécurité)',
            definition: 'Metodología francesa de gestión de riesgos de seguridad de la información desarrollada por la ANSSI (Agencia Nacional de Seguridad de Sistemas de Información de Francia) desde 2004. Al igual que MEHARI, es ampliamente utilizada en la administración pública europea y estructurada en cinco módulos: contexto, eventos temidos, escenarios estratégicos, escenarios operativos y tratamiento del riesgo.',
            fake: true,
          },
        ],
      },

      // ── Ronda 3 ─────────────────────────────────────
      {
        id: 'r2-cobit',
        topic: 'Procesos de Riesgo en COBIT 5.0',
        concepts: [
          {
            id: 'edm03',
            name: 'Asegurar la Optimización del Riesgo (EDM03)',
            definition: 'Proceso de gobierno de COBIT 5.0, bajo el dominio "Evaluar, Dirigir y Supervisar" (EDM). Requerido para asegurar que el apetito y la tolerancia al riesgo de una organización sean entendidos, articulados y comunicados, y que el riesgo para el valor de la empresa relacionado con el uso de las TIC sea identificado y gestionado.',
            fake: false,
          },
          {
            id: 'edm0301',
            name: 'EDM03.01: Evaluar la Gestión de Riesgos',
            definition: 'Primera práctica de gobierno dentro de EDM03. Examina y evalúa continuamente el efecto del riesgo sobre el uso actual y futuro de las TIC en la empresa. Considera si el apetito de riesgo de la empresa es apropiado y si el riesgo sobre el valor de la empresa relacionado con el uso de TIC es identificado y gestionado.',
            fake: false,
          },
          {
            id: 'edm0302',
            name: 'EDM03.02: Orientar la Gestión de Riesgos',
            definition: 'Segunda práctica de gobierno dentro de EDM03. Orienta el establecimiento de prácticas de gestión de riesgos para asegurar que el riesgo en TIC actual no excede el apetito de riesgo definido por la organización.',
            fake: false,
          },
          {
            id: 'edm0303',
            name: 'EDM03.03: Supervisar la Gestión de Riesgos',
            definition: 'Tercera práctica de gobierno dentro de EDM03. Supervisa los objetivos y las métricas clave de los procesos de gestión de riesgo y establece cómo las desviaciones o los problemas serán identificados, seguidos e informados para su resolución.',
            fake: false,
          },
          {
            id: 'apo12',
            name: 'Gestionar el Riesgo (APO12)',
            definition: 'Proceso de gestión de COBIT 5.0 en el dominio "Alinear, Planificar y Organizar" (APO). Permite identificar, evaluar y reducir los riesgos de TIC de forma continua, dentro de los niveles de tolerancia establecidos por la dirección de la empresa. Contempla 6 prácticas de gestión: recopilar datos, analizar el riesgo, mantener un perfil de riesgo, expresar el riesgo, definir un portafolio de acciones y responder al riesgo.',
            fake: false,
          },
          {
            id: 'apo1203',
            name: 'APO12.03: Mantener un Perfil de Riesgo',
            definition: 'Práctica de gestión de APO12. Mantiene un inventario del riesgo conocido y atributos de riesgo (incluyendo frecuencia esperada, impacto potencial y respuestas) y de otros recursos, capacidades y actividades de control actuales y relacionadas.',
            fake: false,
          },
          {
            id: 'apo1206',
            name: 'APO12.06: Responder al Riesgo',
            definition: 'Práctica de gestión de APO12. Responde de una forma oportuna con medidas efectivas que limiten la magnitud de pérdida por eventos relacionados con TIC.',
            fake: false,
          },
          {
            id: 'apo1207-falso',
            name: 'APO12.07: Reportar el Riesgo Residual',
            definition: 'Séptima práctica de gestión del proceso APO12 de COBIT 5.0, que establece el procedimiento formal para comunicar el riesgo residual —una vez aplicadas las salvaguardas— al consejo directivo y a los propietarios de riesgo correspondientes, asegurando la trazabilidad entre el riesgo inherente valorado y las medidas de mitigación implementadas.',
            fake: true,
          },
        ],
      },

      // ── Ronda 4 ─────────────────────────────────────
      {
        id: 'r2-cia',
        topic: 'La Tríada CIA de Seguridad de la Información',
        concepts: [
          {
            id: 'triada-cia',
            name: 'Tríada CIA (Confidentiality, Integrity, Availability)',
            definition: 'Los tres parámetros principales para medir el impacto de cualquier riesgo tecnológico sobre la información. De acuerdo con el análisis comparativo de 10 metodologías de riesgos de TIC realizado por Parra et al. (2013), los criterios para medir el impacto del riesgo en el 100% de ellas contemplan la tríada CIA.',
            fake: false,
          },
          {
            id: 'confidencialidad',
            name: 'Confidencialidad (C de CIA)',
            definition: 'Asociada con el acceso y uso de la información únicamente por parte de quienes se encuentran autorizados y tienen la necesidad de conocerla. En términos formales, y de acuerdo con la norma ISO/IEC 27000, es la propiedad que tiene la información de no estar disponible o revelada a individuos, entidades o procesos no autorizados.',
            fake: false,
          },
          {
            id: 'integridad',
            name: 'Integridad (I de CIA)',
            definition: 'La propiedad de salvaguardar la exactitud e integridad de la información y de los activos tecnológicos ante su modificación o destrucción no autorizada. La norma ISO/IEC 27000:2014 la define como la propiedad de exactitud y completitud: si la información está completa y libre de errores, es íntegra.',
            fake: false,
          },
          {
            id: 'disponibilidad',
            name: 'Disponibilidad (D de CIA)',
            definition: 'Hace referencia a que los usuarios autorizados tienen acceso a la información y a los activos tecnológicos cuando lo requieran. La norma ISO/IEC 27000:2016 la define como la propiedad de ser accesible y utilizable a petición de una entidad autorizada. Dentro de las amenazas más cotidianas que afectan la disponibilidad se encuentra la denegación del servicio.',
            fake: false,
          },
          {
            id: 'atributos-complementarios',
            name: 'Atributos Complementarios de la CIA',
            definition: 'Además de la tríada CIA, existen otros atributos considerados complementarios de la seguridad de la información según la norma ISO/IEC: la autenticidad, la responsabilidad (accountability), la confiabilidad y el no repudio. No todos los modelos de riesgos los contemplan, pero sí la totalidad contempla CIA.',
            fake: false,
          },
          {
            id: 'no-repudio',
            name: 'No Repudio (Atributo Complementario)',
            definition: 'Atributo complementario a la tríada CIA que impide que alguien niegue haber realizado una determinada acción sobre la información (envío, recepción o modificación). Se sustenta en mecanismos de firma digital y registros de auditoría, y está reconocido como atributo complementario por la norma ISO/IEC.',
            fake: false,
          },
          {
            id: 'nist-fips199',
            name: 'NIST FIPS PUB 199: Parámetros de Impacto CIA',
            definition: 'Estándares para la categorización de seguridad de la información federal y los sistemas de información del NIST (National Institute of Standards and Technology), que establecen parámetros de impacto bajo, moderado y alto para evaluar cada uno de los tres elementos de la tríada CIA: confidencialidad, integridad y disponibilidad.',
            fake: false,
          },
          {
            id: 'trazabilidad-activa-falso',
            name: 'Trazabilidad Activa (Sexto Atributo CIA Extendido)',
            definition: 'Capacidad definida en la actualización de la norma ISO/IEC 27000:2018 que establece la trazabilidad en tiempo real de todos los flujos de acceso a activos de información como el sexto atributo oficial de la tríada CIA extendida, equiparable en importancia a la confidencialidad y la disponibilidad en entornos de computación distribuida.',
            fake: true,
          },
        ],
      },

      // ── Ronda 5 ─────────────────────────────────────
      {
        id: 'r2-activos-capas',
        topic: 'Activos TIC y las 12 Capas Tecnológicas',
        concepts: [
          {
            id: 'capa1-procesos',
            name: 'Capa 1: Procesos de Negocio',
            definition: 'Primera capa del modelo de Valencia, Marulanda y López (2015). Son todas aquellas actividades desarrolladas por la organización para cumplir con sus objetivos. Agrupadas en categorías como procedimientos y macroprocesos (estratégicos, misionales y de apoyo). Son la capa de mayor nivel de abstracción y la que más depende de las capas inferiores.',
            fake: false,
          },
          {
            id: 'capa2-servicios',
            name: 'Capa 2: Servicios de TIC',
            definition: 'Segunda capa del modelo. Según la Information Technology Infrastructure Library (ITIL), un servicio de TIC es un medio por el cual se entrega valor a los clientes (usuarios) facilitando un resultado deseado, sin que estos asuman los costos y riesgos específicos. Los servicios son desarrollados por las personas y construidos a partir de la infraestructura tecnológica y los procesos de gestión y operación de TIC.',
            fake: false,
          },
          {
            id: 'capa3-datos',
            name: 'Capa 3: Datos, Información y Conocimiento',
            definition: 'Tercera capa del modelo. Considerados los recursos más valiosos para la organización y los que, en definitiva, requieren mayor nivel de protección. Es la capa que concentra las propiedades de la tríada CIA con mayor intensidad.',
            fake: false,
          },
          {
            id: 'capa4-sistemas-transac',
            name: 'Capa 4: Sistemas de Información Transaccionales',
            definition: 'Cuarta capa del modelo. Son todos aquellos sistemas de información que utiliza la organización para automatizar sus procesos de negocio. Ejemplos: ERP (Enterprise Resource Planning), CRM (Customer Relation Management), sistemas de información de nómina y sistemas de información de ventas.',
            fake: false,
          },
          {
            id: 'capa6-motores-bd',
            name: 'Capa 6: Motores de Bases de Datos',
            definition: 'Sexta capa del modelo. Equivale a lo que en el mercado se conoce como sistemas gestores de bases de datos (SGBD), los cuales permiten añadir, borrar, modificar, almacenar y analizar los datos que tiene una organización. Principales ejemplos: Oracle, SQL Server, PostgreSQL y MySQL.',
            fake: false,
          },
          {
            id: 'capa9-servidores',
            name: 'Capa 9: Servidores (físicos, virtuales y en la nube)',
            definition: 'Novena capa del modelo. Computadores dotados de características especiales (mayor capacidad de procesamiento, multitarea, mayores capacidades de almacenamiento, mayor capacidad en memoria) al servicio de otros dispositivos, para tareas especializadas. Tres tipos genéricos: servidores físicos, servidores virtuales y servidores en la nube.',
            fake: false,
          },
          {
            id: 'capa12-energia',
            name: 'Capa 12: Sistemas de Energía',
            definition: 'Duodécima capa del modelo, considerada una de las más importantes de la infraestructura tecnológica por ser la que permite que las demás capas puedan cumplir su función. Incluye todos los servicios y dispositivos que permiten que los dispositivos físicos de procesamiento de información puedan operar, generadores de energía alterna y dispositivos de resguardo como bancos de baterías y UPS.',
            fake: false,
          },
          {
            id: 'capa13-nube-falso',
            name: 'Capa 13: Ecosistemas de Nube e Interoperabilidad',
            definition: 'Decimotercera capa incorporada al modelo de Valencia, Marulanda y López en su versión actualizada de 2018, que reconoce los entornos cloud híbridos, las APIs de integración y los servicios de interoperabilidad como una capa diferenciada de infraestructura, con riesgos propios distintos a los de los servidores en nube de la capa 9.',
            fake: true,
          },
        ],
      },

      // ── Ronda 6 ─────────────────────────────────────
      {
        id: 'r2-taxonomia-valoracion',
        topic: 'Taxonomía y Valoración de Riesgos de TIC',
        concepts: [
          {
            id: 'valoracion-cuantitativa',
            name: 'Valoración Cuantitativa del Riesgo',
            definition: 'Enfoque que evalúa numéricamente la probabilidad y el impacto del riesgo. Con tal objetivo utiliza, en algunos casos, teorías de probabilidades y estadísticas para determinar el nivel de riesgo. Permite expresar el riesgo en términos monetarios o porcentuales.',
            fake: false,
          },
          {
            id: 'valoracion-cualitativa',
            name: 'Valoración Cualitativa del Riesgo',
            definition: 'Enfoque más usado en el ámbito productivo. Está basado en escalas descriptivas, por lo general entre 3 y 5 niveles (por ejemplo: bajo, medio, alto). En algunos casos se acude a la opinión de los expertos para seleccionar el nivel al cual corresponde la probabilidad de ocurrencia o el impacto en caso de ocurrir el riesgo.',
            fake: false,
          },
          {
            id: 'valoracion-hibrida',
            name: 'Valoración Híbrida del Riesgo',
            definition: 'Corresponde al uso de valoraciones cuantitativas y cualitativas en las diferentes fases de la gestión del riesgo. Se puede utilizar un enfoque cuantitativo para la valoración de activos y un enfoque cualitativo para la valoración de probabilidad e impacto.',
            fake: false,
          },
          {
            id: 'riesgo-propagado',
            name: 'Riesgo Propagado',
            definition: 'Categoría de medición del riesgo en la taxonomía de Shameli-Sendi et al. (2016). Su medición depende del efecto que tengan los riesgos de los activos de los cuales depende el activo objeto de análisis, es decir, considera el efecto dominó entre capas tecnológicas interdependientes.',
            fake: false,
          },
          {
            id: 'riesgo-no-propagado',
            name: 'Riesgo No Propagado',
            definition: 'Categoría de medición del riesgo en la taxonomía de Shameli-Sendi et al. (2016). Se basa en la evaluación individual de cada riesgo, sin tener en cuenta el efecto de la propagación del riesgo que viene de otros recursos tecnológicos del cual depende.',
            fake: false,
          },
          {
            id: 'perspectiva-activos',
            name: 'Perspectiva de Análisis Basada en Activos',
            definition: 'Una de las tres perspectivas de la taxonomía de metodologías de riesgos de TIC. Es donde se concentra la mayor cantidad de las metodologías existentes. Analiza el riesgo en función de los activos tecnológicos de la organización (hardware, software, datos, etc.) y sus dependencias.',
            fake: false,
          },
          {
            id: 'catalogo-amenazas',
            name: 'Catálogo de Amenazas de TIC',
            definition: 'Herramienta útil para predeterminar las amenazas potenciales que pueden afectar a una organización; debe ser construida en función del contexto de la organización. Se pueden construir catálogos genéricos de amenazas de TIC. Ejemplo: la tabla propuesta por Rahmad et al. (2010) a partir de una combinación de MAGERIT e ISO/IEC 27005, con categorías: amenazas naturales, fallas técnicas o ambientales, accidentes humanos y acciones humanas deliberadas.',
            fake: false,
          },
          {
            id: 'matriz-calor-falso',
            name: 'Matriz de Calor Estandarizada ISO (Heat Map)',
            definition: 'Herramienta definida en el Anexo B de la norma ISO/IEC 27005:2018 que establece un formato universal de representación gráfica del nivel de riesgo residual, donde el eje X corresponde al impacto CIA y el eje Y a la probabilidad de ocurrencia, con zonas de color codificadas según el apetito de riesgo organizacional.',
            fake: true,
          },
        ],
      },

      // ── Ronda 7 ─────────────────────────────────────
      {
        id: 'r2-cert',
        topic: 'Certificaciones Profesionales en Riesgos y Auditoría TI',
        concepts: [
          {
            id: 'crisc',
            name: 'CRISC (Certified in Risk and Information Systems Control)',
            definition: 'Certificación establecida en 2009 por ISACA. Representa el respaldo de contar con conocimientos y experiencia práctica para integrar la gestión del riesgo organizacional con habilidades de control de sistemas de información. Fue catalogada por la encuesta IT Skills and Salary Survey 2015 como la certificación mejor valorada dentro de las certificaciones de tecnologías de información. Requiere mínimo 3 años de experiencia en al menos 2 de sus 4 dominios de conocimiento.',
            fake: false,
          },
          {
            id: 'crisc-dominios',
            name: 'Cuatro Dominios de Conocimiento del CRISC',
            definition: 'La certificación CRISC contempla cuatro dominios: (1) identificación de riesgos, (2) evaluación de riesgos, (3) mitigación y respuesta al riesgo, e (4) informes y monitoreo sobre controles y riesgos. El profesional debe demostrar experiencia de al menos 3 años consecutivos en mínimo 2 de estos 4 dominios.',
            fake: false,
          },
          {
            id: 'cisa',
            name: 'CISA (Certified Information Systems Auditor)',
            definition: 'Certificación de ISACA para profesionales de auditoría de TI. La sigla CISA también puede referirse al cargo Chief Information System Auditor dentro de la tabla de perfiles del aseguramiento tecnológico, según el libro de Valencia et al.',
            fake: false,
          },
          {
            id: 'cism',
            name: 'CISM (Certified Information Security Manager)',
            definition: 'Certified Information Security Manager. Certificación de ISACA orientada a quienes gestionan, diseñan y supervisan programas de seguridad de la información a nivel gerencial y estratégico.',
            fake: false,
          },
          {
            id: 'cia-cert',
            name: 'CIA (Certified Internal Auditor)',
            definition: 'Única certificación global de auditoría interna reconocida y otorgada por el IIA. Es la certificación más representativa para quienes ejercen la función de tercera línea de defensa en el modelo 3LoD.',
            fake: false,
          },
          {
            id: 'iso27001-lead',
            name: 'Auditor Líder ISO/IEC 27001',
            definition: 'Certificación internacional que habilita a un profesional para planear, ejecutar y dirigir auditorías de sistemas de gestión de seguridad de la información (SGSI) conforme a la norma ISO/IEC 27001 y los lineamientos de ISO 19011.',
            fake: false,
          },
          {
            id: 'cgeit-falso',
            name: 'CGEIT (Certified in the Governance of Enterprise IT)',
            definition: 'Certificación de ISACA mencionada en el libro como la principal acreditación a nivel gerencial para los responsables del gobierno corporativo de TIC, dirigida al CIO y al Director de Gobierno TIC. Requiere 5 años de experiencia en responsabilidades de gobierno de TI y su examen cubre cinco dominios alineados con el marco COBIT 5.',
            fake: true,
          },
        ],
      },

    ], // fin rounds cap 2

    glossary: [
      {
        term: 'Gestión de Riesgos de TIC',
        definition: 'Proceso sistemático para identificar, analizar, evaluar y definir planes de tratamiento de todos los eventos adversos que pueden impactar los recursos tecnológicos o la información de una organización.',
        example: 'Una empresa bancaria implementa ISO 31000 + RISK IT para gestionar el riesgo de una brecha en su sistema de pagos: lo identifica, estima su impacto en $5M y decide transferirlo contratando un seguro cibernético.',
      },
      {
        term: 'Tríada CIA',
        definition: 'Confidencialidad, Integridad y Disponibilidad. Los tres pilares para medir el impacto de cualquier riesgo tecnológico sobre la información. Contemplada por el 100% de las metodologías de riesgos de TIC según Parra et al. (2013).',
        example: 'Un ransomware ataca los tres: cifra los archivos (confidencialidad), los altera (integridad) y los hace inaccesibles (disponibilidad). El impacto se mide por cuál atributo fue más afectado.',
      },
      {
        term: 'COBIT 5.0',
        definition: 'Marco de ISACA para el gobierno y gestión de TI. Sus procesos clave de riesgo son: EDM03 (asegurar la optimización del riesgo, con 3 prácticas) y APO12 (gestionar el riesgo, con 6 prácticas).',
        example: 'El auditor usa APO12.03 para revisar si la empresa mantiene actualizado su registro de riesgos, y EDM03.01 para verificar que la junta directiva haya evaluado su apetito de riesgo.',
      },
      {
        term: 'RISK IT (ISACA)',
        definition: 'Marco de ISACA que complementa a COBIT con tres dominios: Gobierno del riesgo de TI (RG), Evaluación del riesgo de TI (RE) y Respuesta al riesgo de TI (RR), con nueve procesos interrelacionados.',
        example: 'Un gerente de riesgos usa RISK IT — dominio RE — para evaluar si la vulnerabilidad detectada en el servidor de correos representa un riesgo alto o tolerable para el negocio.',
      },
      {
        term: 'MAGERIT v3',
        definition: 'Metodología española de análisis y gestión de riesgos de los sistemas de información. Compuesta por tres libros: método, catálogo de elementos y guía de técnicas. Herramienta de soporte: Pilar.',
        example: 'Una entidad pública española usa MAGERIT para catalogar sus activos (servidores, base de datos de ciudadanos), identificar la amenaza de acceso no autorizado y seleccionar salvaguardas de control de acceso.',
      },
      {
        term: 'Modelo de 12 Capas TIC',
        definition: 'Propuesto por Valencia, Marulanda y López (2015). 12 capas tecnológicas interdependientes organizadas desde los procesos de negocio (capa 1) hasta los sistemas de energía (capa 12), donde una falla en una capa puede generar un efecto dominó sobre las demás.',
        example: 'Una falla en la capa 12 (energía) deja sin funcionamiento los servidores (capa 9), lo que tumba las bases de datos (capa 6), los sistemas transaccionales (capa 4) y finalmente los procesos de negocio (capa 1).',
      },
      {
        term: 'CRISC',
        definition: 'Certified in Risk and Information Systems Control. Certificación de ISACA (2009) para profesionales que integran la gestión del riesgo organizacional con el control de sistemas de información. Catalogada como la certificación TI mejor valorada por IT Skills and Salary Survey 2015.',
        example: 'Un profesional CRISC lidera el comité de riesgos de TI de una aseguradora y certifica ante la junta directiva que el nivel de riesgo residual está dentro del apetito de riesgo aprobado.',
      },
      {
        term: 'Catálogo de Amenazas',
        definition: 'Herramienta para predeterminar amenazas potenciales según el contexto organizacional. Categorías genéricas: amenazas naturales, fallas técnicas o ambientales, accidentes humanos y acciones humanas deliberadas (Rahmad et al., 2010, basado en MAGERIT e ISO/IEC 27005).',
        example: 'Una organización construye su catálogo de amenazas y detecta que el sabotaje interno (acciones humanas deliberadas) es la categoría con mayor probabilidad para su contexto, priorizando controles de acceso privilegiado.',
      },
    ],
  },

];
