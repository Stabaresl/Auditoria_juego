// ═══════════════════════════════════════════════════════
//  DATOS DEL JUEGO — El Concepto Infiltrado
//  Basado en: Valencia et al. (2016) & Libro Auditoría TI
//  v2.0 — Banco expandido con nombres completos
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
            id: 'riesgo',
            name: 'Riesgo',
            definition: 'Término asociado a la incertidumbre sobre un aspecto específico. Como sistema de gestión, utiliza técnicas para identificar, analizar, valorar, mitigar y monitorear eventos negativos o positivos que pueden impactar los objetivos organizacionales.',
            fake: false,
          },
          {
            id: 'control',
            name: 'Control',
            definition: 'Disciplina independiente dentro de la tríada del aseguramiento. Comprende las medidas, políticas y procedimientos que una organización implementa para mitigar riesgos y garantizar el cumplimiento de sus objetivos.',
            fake: false,
          },
          {
            id: 'auditoria',
            name: 'Auditoría',
            definition: 'Tercera disciplina de la tríada del aseguramiento. Función independiente y objetiva que recolecta y evalúa evidencia para determinar si los controles funcionan eficazmente para mitigar los riesgos identificados.',
            fake: false,
          },
          {
            id: 'aseguramiento',
            name: 'Aseguramiento',
            definition: 'Función organizacional diseñada para mejorar el grado de confianza que se tiene sobre un asunto particular. Según el IAA, provee aseguramiento sobre la efectividad del gobierno, administración de riesgos y control.',
            fake: false,
          },
          {
            id: 'gobierno-corporativo',
            name: 'Gobierno Corporativo',
            definition: 'Sistema a través del cual las empresas son dirigidas y controladas para lograr los objetivos previstos. Es uno de los conceptos centrales del marco GRC según el OCEG.',
            fake: false,
          },
          {
            id: 'supervision-integral',
            name: 'Supervisión Integral Continua (SIC)',
            definition: 'Proceso dinámico y permanente mediante el cual la alta gerencia valida en tiempo real que los tres elementos de la tríada —riesgo, control y auditoría— operen de forma sincronizada y sin brechas.',
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
            definition: 'Marco de referencia emitido en 2008 por el OCEG (Open Compliance and Ethics Group) que integra conceptualmente el gobierno corporativo, la gestión de riesgos y las funciones de cumplimiento para unificar criterios y coordinar esfuerzos.',
            fake: false,
          },
          {
            id: 'cumplimiento',
            name: 'Cumplimiento',
            definition: 'Compromisos internos y externos —generalmente obligatorios— que debe cumplir una organización en el desarrollo de su misión. Incluye requerimientos regulatorios, políticas internas, acuerdos con proveedores y normas sectoriales.',
            fake: false,
          },
          {
            id: 'it-grc',
            name: 'Gobierno, Riesgo y Cumplimiento de TI (IT GRC)',
            definition: 'Subconjunto del GRC corporativo compuesto por tres cuerpos de conocimiento integrados: gobierno de TIC, riesgos de TIC y cumplimiento regulatorio y normativo de TIC.',
            fake: false,
          },
          {
            id: 'oceg',
            name: 'Grupo Abierto de Cumplimiento y Ética (OCEG)',
            definition: 'Open Compliance and Ethics Group. Organización que emitió el marco GRC en 2008. Promueve la unificación de criterios, la coordinación de esfuerzos y la colaboración entre los responsables de la dirección organizacional.',
            fake: false,
          },
          {
            id: 'gobierno-tic',
            name: 'Gobierno Corporativo de TIC',
            definition: 'Definido por el ITGI (IT Governance Institute) como responsabilidad del comité de dirección y los ejecutivos. Consiste en el liderazgo, estructura y procesos que aseguran que las TIC sostengan y extiendan la estrategia organizacional.',
            fake: false,
          },
          {
            id: 'grc-360',
            name: 'Marco de Cumplimiento Circular (GRC-360°)',
            definition: 'Extensión propietaria del GRC publicada por el OCEG en 2015 que incorpora un ciclo de retroalimentación continua entre gobierno, riesgo y cumplimiento para adaptarse a entornos regulatorios cambiantes.',
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
            definition: 'Modelo establecido por el IIA Global en 2013 mediante una declaración de posición. Establece roles específicos alrededor de riesgo, control y auditoría para los diferentes grupos de interés relacionados con el aseguramiento organizacional.',
            fake: false,
          },
          {
            id: 'primera-linea',
            name: 'Primera Línea de Defensa',
            definition: 'Asumida por la gerencia en sus diferentes niveles (gerencia general y gerencias operativas), así como la función de control interno. Es la línea que gestiona los riesgos en el día a día de la operación.',
            fake: false,
          },
          {
            id: 'segunda-linea',
            name: 'Segunda Línea de Defensa',
            definition: 'Conformada por las áreas especializadas que ejercen diferentes funciones de control y aseguramiento en la organización: controles financieros, seguridad, gestión de riesgos, calidad, inspección y cumplimiento.',
            fake: false,
          },
          {
            id: 'tercera-linea',
            name: 'Tercera Línea de Defensa',
            definition: 'La auditoría interna. Actúa de forma independiente y objetiva, en concordancia con las normas internacionales de auditoría interna, y reporta a los diferentes organismos de gobierno corporativo.',
            fake: false,
          },
          {
            id: 'cuarta-linea',
            name: 'Cuarta Línea de Defensa (organismos externos)',
            definition: 'Considerada por algunos autores como la cuarta línea. Corresponde a funciones externas de control ejercidas por organismos públicos como contralorías o entes sectoriales, y por organizaciones privadas que realizan revisoría fiscal o auditoría de tercera parte.',
            fake: false,
          },
          {
            id: 'linea-cero',
            name: 'Línea Cero de Defensa (L0D)',
            definition: 'Concepto propuesto por el IIA en 2021 que reconoce a los usuarios finales y ciudadanos como primera barrera de detección de fraudes y anomalías, situados antes de la gerencia en el modelo de defensa organizacional.',
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
            definition: 'Alternativa para integrar la información de aseguramiento de diferentes actores internos y externos, evitando que la alta gerencia reciba reportes fragmentados y minimizando la duplicación de esfuerzos.',
            fake: false,
          },
          {
            id: 'mapa-aseguramiento',
            name: 'Mapa de Aseguramiento',
            definition: 'Herramienta diseñada para establecer una adecuada coordinación de los diferentes actores internos y externos relacionados con la función de aseguramiento, minimizando duplicación de esfuerzos y garantizando cobertura adecuada.',
            fake: false,
          },
          {
            id: 'auditoria-integrada',
            name: 'Auditorías Integradas',
            definition: 'Forma de coordinar el aseguramiento combinado que se logra a través del desarrollo de auditorías conjuntas con funciones de soporte (por ejemplo, de calidad) o auditores externos.',
            fake: false,
          },
          {
            id: 'integracion-funcional',
            name: 'Integración Funcional',
            definition: 'Forma de coordinación del aseguramiento combinado que consiste en integrar áreas o funciones que desarrollan labores de aseguramiento, como la integración de las áreas de calidad con las áreas de control interno.',
            fake: false,
          },
          {
            id: 'iia-2050',
            name: 'Estándar de Coordinación IIA 2050',
            definition: 'Consejo para la práctica del IIA relacionado con la coordinación. Establece que el director ejecutivo de auditoría debe compartir información y coordinar actividades con otros proveedores internos y externos de aseguramiento.',
            fake: false,
          },
          {
            id: 'cbok-voice',
            name: 'Documento CBOK "Una voz, una visión" (Combined Assurance)',
            definition: 'Documento del Common Body of Knowledge del IIA Global titulado Combined assurance: One language, one voice, one view, que plantea el aseguramiento combinado como solución al problema de alineamiento e integración de funciones de aseguramiento.',
            fake: false,
          },
          {
            id: 'pad-dual',
            name: 'Protocolo de Aseguramiento Dual (PAD)',
            definition: 'Mecanismo propuesto por Huibers (2017) que combina auditoría interna y externa para validar controles de forma simultánea y vinculante, reduciendo el tiempo de cobertura en un 40% según estudios del IIA.',
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
            name: 'Director de Riesgos Organizacional (CRO)',
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
            name: 'Director Ejecutivo de Auditoría (CAO/CAE)',
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
            id: 'ciao',
            name: 'Director de Auditoría e Innovación (CIAO)',
            definition: 'Chief Innovation and Audit Officer. Perfil emergente definido por el IIA en 2022 que combina las responsabilidades del CAE con la supervisión de iniciativas de transformación digital dentro del aseguramiento corporativo.',
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
            definition: 'Sistema de control cuyo objetivo es verificar diariamente que todas las actividades de los sistemas de información sean realizadas cumpliendo los procedimientos, estándares y normas fijadas por la organización. El modelo más representativo es COBIT.',
            fake: false,
          },
          {
            id: 'sgsi',
            name: 'Sistema de Gestión de Seguridad de la Información (SGSI / ISO 27001)',
            definition: 'Norma ISO/IEC 27001 que establece un sistema de gestión de seguridad de la información. Preserva la confidencialidad, integridad y disponibilidad mediante la aplicación de un proceso de gestión del riesgo.',
            fake: false,
          },
          {
            id: 'seg-informatica',
            name: 'Seguridad Informática',
            definition: 'Conjunto de procedimientos, dispositivos y herramientas encargadas de asegurar la integridad, disponibilidad y privacidad de la información en un sistema informático, intentando reducir las amenazas que pueden afectarlo (García, Hurtado y Alegre, 2011).',
            fake: false,
          },
          {
            id: 'comp-forense',
            name: 'Computación Forense',
            definition: 'Disciplina de las ciencias forenses que procura descubrir e interpretar la información en medios informáticos para establecer los hechos y formular hipótesis relacionadas con el caso, utilizando métodos científicos para preservar, recolectar y presentar evidencias digitales (Cano, 2009).',
            fake: false,
          },
          {
            id: 'auditoria-sistemas',
            name: 'Auditoría de Sistemas (IT Assurance)',
            definition: 'Función de aseguramiento a través de la cual se recolecta y evalúa evidencia suficiente y pertinente para determinar si los controles que mitigan los riesgos de TIC son eficaces y eficientes para proteger el cumplimiento de los objetivos organizacionales.',
            fake: false,
          },
          {
            id: 'auditoria-predictiva',
            name: 'Auditoría Predictiva Algorítmica (APA)',
            definition: 'Campo emergente que utiliza modelos de inteligencia artificial para anticipar hallazgos de auditoría antes de ejecutar las pruebas sustantivas, reduciendo hasta un 60% el tiempo de planificación según el marco ISO 19011:2022.',
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
            name: 'Parte Responsable (Componente 1 de la Iniciativa de Aseguramiento)',
            definition: 'Primer componente de una iniciativa de aseguramiento TIC según COBIT 5. Es la entidad o área auditada que gobierna y gestiona el asunto sobre el que se va a proporcionar aseguramiento.',
            fake: false,
          },
          {
            id: 'asunto-auditoria',
            name: 'El Asunto (Componente 2 de la Iniciativa de Aseguramiento)',
            definition: 'Segundo componente. Equivale al objeto de análisis de la auditoría: puede incluir infraestructura tecnológica, aplicaciones de negocio y prácticas de gobierno y gestión de tecnologías de información.',
            fake: false,
          },
          {
            id: 'criterios-adecuados',
            name: 'Criterios Adecuados (Componente 3 de la Iniciativa de Aseguramiento)',
            definition: 'Tercer componente. Son los parámetros contra los que se confronta la evidencia obtenida en el proceso de auditoría, basados en mejores prácticas o en las políticas, procedimientos y prácticas establecidas formalmente en la organización.',
            fake: false,
          },
          {
            id: 'ejecucion-auditoria',
            name: 'Ejecución de la Auditoría (Componente 4 de la Iniciativa de Aseguramiento)',
            definition: 'Cuarto componente. Incorpora las pruebas sustantivas y de cumplimiento necesarias para evaluar el nivel de conformidad de los criterios de auditoría establecidos previamente.',
            fake: false,
          },
          {
            id: 'conclusion-auditoria',
            name: 'Conclusión de la Auditoría (Componente 5 de la Iniciativa de Aseguramiento)',
            definition: 'Quinto y último componente. Se realiza formalmente a través de una comunicación que contiene los hallazgos y recomendaciones que se hacen a partir del análisis proporcionado por la evidencia obtenida.',
            fake: false,
          },
          {
            id: 'matriz-impacto',
            name: 'Matriz de Impacto Cruzado (Componente 6 de la Iniciativa de Aseguramiento)',
            definition: 'Componente adicional de la guía COBIT 5 para aseguramiento que vincula cada hallazgo con un proceso APO/BAI/DSS específico, permitiendo priorizar automáticamente las recomendaciones según su impacto en la cadena de valor de TIC.',
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
  //  CAPÍTULO 2 — Gobierno y Gestión de Riesgos de TI
  // ══════════════════════════════════════════════════════
  {
    id: 'riesgos-ti',
    num: '02',
    name: 'Gobierno y Gestión de Riesgos de TI',
    description: 'Metodologías, COBIT 5.0 y la Tríada CIA',
    rounds: [

      // ── Ronda 1 ─────────────────────────────────────
      {
        id: 'r2-metodologias',
        topic: 'Metodologías de Gestión de Riesgos de TIC',
        concepts: [
          {
            id: 'risk-it',
            name: 'Marco de Gestión de Riesgo de TI — RISK IT (ISACA)',
            definition: 'Marco de ISACA basado en principios y procesos para gestionar riesgos de TI. Complementa a COBIT y establece tres dominios: gobierno del riesgo de TI, evaluación del riesgo de TI y respuesta al riesgo de TI.',
            fake: false,
          },
          {
            id: 'magerit',
            name: 'Metodología de Análisis y Gestión de Riesgos (MAGERIT v3)',
            definition: 'Metodología de Análisis y Gestión de Riesgos de los Sistemas de Información, desarrollada y usada en la Administración Pública Española. Permite identificar activos, amenazas, vulnerabilidades e impactos de forma estructurada.',
            fake: false,
          },
          {
            id: 'octave',
            name: 'Evaluación de Activos Críticos, Amenazas y Vulnerabilidades (OCTAVE)',
            definition: 'Operationally Critical Threat, Asset and Vulnerability Evaluation. Colección de técnicas del SEI de Carnegie Mellon orientada a la organización y sus activos operativos más críticos.',
            fake: false,
          },
          {
            id: 'mehari',
            name: 'Método Armonizado de Análisis de Riesgo (MEHARI)',
            definition: 'Method for Harmonized Analysis of Risk. Desarrollado por CLUSIF (Club de Seguridad de la Información de Francia) desde 1996 para evaluar y gestionar riesgos de seguridad de la información de forma cuantitativa y cualitativa.',
            fake: false,
          },
          {
            id: 'cramm',
            name: 'Método de Análisis y Gestión de Riesgos del Gobierno UK (CRAMM)',
            definition: 'CCTA Risk Analysis and Management Method. Metodología del gobierno del Reino Unido desde 1987. Estructurada en tres etapas: establecimiento de objetivos de seguridad, análisis de riesgos y selección y recomendación de controles.',
            fake: false,
          },
          {
            id: 'isareg',
            name: 'Guías Integradas de Seguridad y Evaluación de Riesgos (ISAREG 360°)',
            definition: 'Integrated Security Assurance and Risk Evaluation Guidelines. Estándar ISO/TC 45 publicado en 2014 para entornos digitales distribuidos que incorpora análisis de contexto geopolítico en la gestión de riesgos.',
            fake: true,
          },
        ],
      },

      // ── Ronda 2 ─────────────────────────────────────
      {
        id: 'r2-cobit',
        topic: 'Procesos de Riesgo en COBIT 5.0',
        concepts: [
          {
            id: 'edm03',
            name: 'Asegurar la Optimización del Riesgo (EDM03)',
            definition: 'Proceso de gobierno de COBIT 5.0 que identifica y gestiona el riesgo del valor empresarial asociado al uso de TI. Garantiza que el apetito de riesgo y la tolerancia al riesgo de la empresa sean entendidos, articulados y comunicados.',
            fake: false,
          },
          {
            id: 'apo12',
            name: 'Gestionar el Riesgo (APO12)',
            definition: 'Proceso de gestión de COBIT 5.0 para identificar, evaluar y reducir continuamente los riesgos de TI dentro de niveles tolerables. Incluye seis prácticas de gestión: desde recopilar datos hasta responder al riesgo.',
            fake: false,
          },
          {
            id: 'apo1203',
            name: 'Mantener un Perfil de Riesgo (APO12.03)',
            definition: 'Práctica de gestión de APO12. Mantiene un inventario del riesgo conocido con sus atributos: frecuencia esperada, impacto potencial y respuestas actuales. Permite tener visibilidad del estado real del riesgo.',
            fake: false,
          },
          {
            id: 'apo1206',
            name: 'Responder al Riesgo (APO12.06)',
            definition: 'Práctica de gestión de APO12. Implementa medidas efectivas de forma oportuna para limitar la magnitud de las pérdidas derivadas de eventos relacionados con TI.',
            fake: false,
          },
          {
            id: 'edm0301',
            name: 'Evaluar la Gestión de Riesgos (EDM03.01)',
            definition: 'Práctica de gobierno dentro de EDM03. Examina y evalúa continuamente el efecto del riesgo sobre el uso actual y futuro de las TI en la empresa para determinar si el perfil de riesgo es aceptable.',
            fake: false,
          },
          {
            id: 'apo1207-falso',
            name: 'Definir Presupuesto de Riesgos Tecnológicos (APO12.07)',
            definition: 'Práctica de gestión de APO12 que establece el presupuesto anual dedicado a la mitigación de riesgos de TI y lo distribuye proporcionalmente entre las unidades de negocio según su nivel de exposición al riesgo residual.',
            fake: true,
          },
        ],
      },

      // ── Ronda 3 ─────────────────────────────────────
      {
        id: 'r2-cia',
        topic: 'La Tríada CIA de Seguridad de la Información',
        concepts: [
          {
            id: 'confidencialidad',
            name: 'Confidencialidad (C de CIA)',
            definition: 'Propiedad de que la información no esté disponible o sea revelada a individuos, entidades o procesos no autorizados (ISO/IEC 27000). Protege que solo accedan quienes tienen permiso.',
            fake: false,
          },
          {
            id: 'integridad',
            name: 'Integridad (I de CIA)',
            definition: 'Propiedad de exactitud y completitud de la información. Salvaguarda la información ante modificación o destrucción no autorizada, garantizando que los datos sean confiables y precisos.',
            fake: false,
          },
          {
            id: 'disponibilidad',
            name: 'Disponibilidad (D de CIA)',
            definition: 'Propiedad de la información de ser accesible y utilizable a petición de una entidad autorizada cuando lo requieran los procesos de negocio. Implica mantener los sistemas operativos y accesibles.',
            fake: false,
          },
          {
            id: 'no-repudio',
            name: 'No Repudio (atributo complementario de CIA)',
            definition: 'Atributo complementario a la tríada CIA que impide que alguien niegue haber realizado una determinada acción sobre la información (envío, recepción o modificación). Se sustenta en mecanismos de firma digital y registros de auditoría.',
            fake: false,
          },
          {
            id: 'autenticidad',
            name: 'Autenticidad (atributo complementario de CIA)',
            definition: 'Atributo que complementa la tríada CIA, garantizando que la identidad de quien actúa sobre la información es verificable y genuina. Previene la suplantación de identidad.',
            fake: false,
          },
          {
            id: 'trazabilidad-activa',
            name: 'Trazabilidad Activa en Tiempo Real (atributo CIA extendido)',
            definition: 'Capacidad de auditar en tiempo real todas las rutas de acceso a activos de información según el protocolo COBIT 5-TA, considerada el sexto atributo oficial de la tríada CIA extendida en la norma ISO/IEC 27001:2022.',
            fake: true,
          },
        ],
      },

      // ── Ronda 4 ─────────────────────────────────────
      {
        id: 'r2-activos',
        topic: 'Clasificación de Activos Tecnológicos',
        concepts: [
          {
            id: 'activos-datos',
            name: 'Activos de Datos e Información',
            definition: 'Primera categoría de activos TIC. Incluye bases de datos, archivos, contratos, documentación, registros de auditoría y cualquier dato que tenga valor para la organización y requiera protección.',
            fake: false,
          },
          {
            id: 'activos-software',
            name: 'Activos de Software y Aplicaciones',
            definition: 'Categoría de activos TIC que incluye software de aplicación, software de sistemas, herramientas de desarrollo, utilidades y sistemas de información. Son los activos que procesan y gestionan la información.',
            fake: false,
          },
          {
            id: 'activos-hardware',
            name: 'Activos de Hardware e Infraestructura Física',
            definition: 'Categoría de activos TIC que incluye equipos informáticos, servidores, equipos de comunicaciones, medios de almacenamiento y equipamiento técnico necesario para el procesamiento de la información.',
            fake: false,
          },
          {
            id: 'activos-servicios',
            name: 'Activos de Servicios',
            definition: 'Categoría de activos TIC que incluye servicios informáticos y de telecomunicaciones, servicios de soporte técnico y servicios en la nube que soportan los procesos de negocio de la organización.',
            fake: false,
          },
          {
            id: 'activos-personas',
            name: 'Activos de Personas y Competencias',
            definition: 'Categoría de activos TIC que incluye el personal de TI, sus calificaciones, habilidades, experiencia y conocimiento técnico. El capital humano especializado es un activo crítico del área de tecnología.',
            fake: false,
          },
          {
            id: 'activos-reputacionales',
            name: 'Activos Reputacionales Digitales (ARD)',
            definition: 'Categoría de activos TIC definida en la norma ISO/IEC 27005:2022 que cuantifica el valor de la marca digital, la reputación en redes sociales y la confianza del cliente como activos asegurables bajo el esquema COBIT 5.',
            fake: true,
          },
        ],
      },

      // ── Ronda 5 ─────────────────────────────────────
      {
        id: 'r2-cert',
        topic: 'Certificaciones Profesionales en Riesgos y Auditoría TI',
        concepts: [
          {
            id: 'crisc',
            name: 'Certificación en Riesgo y Control de Sistemas de Información (CRISC)',
            definition: 'Certified in Risk and Information Systems Control. Certificación de ISACA considerada una de las mejor pagadas en TI. Requiere 3 años de experiencia en al menos 2 de 4 dominios: identificación, evaluación, respuesta y monitoreo del riesgo.',
            fake: false,
          },
          {
            id: 'cisa',
            name: 'Auditor Certificado de Sistemas de Información (CISA)',
            definition: 'Certified Information Systems Auditor. Certificación de ISACA para profesionales de auditoría de TI. La sigla CISA también puede referirse al cargo Chief Information System Auditor dentro de la tabla de perfiles del aseguramiento tecnológico.',
            fake: false,
          },
          {
            id: 'cism',
            name: 'Gerente Certificado de Seguridad de la Información (CISM)',
            definition: 'Certified Information Security Manager. Certificación de ISACA orientada a quienes gestionan, diseñan y supervisan programas de seguridad de la información a nivel gerencial y estratégico.',
            fake: false,
          },
          {
            id: 'iso27001-lead',
            name: 'Auditor Líder ISO/IEC 27001',
            definition: 'Certificación internacional que habilita a un profesional para planear, ejecutar y dirigir auditorías de sistemas de gestión de seguridad de la información (SGSI) conforme a la norma ISO/IEC 27001 y los lineamientos de ISO 19011.',
            fake: false,
          },
          {
            id: 'cia-cert',
            name: 'Auditor Interno Certificado (CIA)',
            definition: 'Certified Internal Auditor. Única certificación global de auditoría interna reconocida y otorgada por el IIA. Es la certificación más representativa para quienes ejercen la función de tercera línea de defensa.',
            fake: false,
          },
          {
            id: 'cgrc',
            name: 'Profesional Certificado en Gobierno de Riesgos y Cumplimiento (CGRC)',
            definition: 'Certified Governance Risk and Compliance Professional. Certificación conjunta del OCEG e ISACA, creada en 2018, que acredita el dominio integral del marco GRC incluyendo sus dimensiones organizacional, tecnológica y regulatoria.',
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
        term: 'Triada CIA',
        definition: 'Confidencialidad, Integridad y Disponibilidad. Los tres pilares para medir el impacto de cualquier riesgo tecnológico sobre la información. Un ataque exitoso compromete uno o más de estos atributos.',
        example: 'Un ransomware ataca los tres: cifra los archivos (confidencialidad), los altera (integridad) y los hace inaccesibles (disponibilidad). El impacto se mide por cuál atributo fue más afectado.',
      },
      {
        term: 'COBIT 5.0',
        definition: 'Marco de ISACA para el gobierno y gestión de TI. Sus procesos clave de riesgo son: EDM03 (asegurar la optimización del riesgo) y APO12 (gestionar el riesgo). Establece 37 procesos en 5 dominios.',
        example: 'El auditor usa APO12.03 para revisar si la empresa mantiene actualizado su registro de riesgos, y EDM03.01 para verificar que la junta directiva haya definido su apetito de riesgo.',
      },
      {
        term: 'RISK IT (ISACA)',
        definition: 'Marco de ISACA publicado en 2009 que complementa a COBIT con tres dominios: gobierno del riesgo de TI (RG), evaluación del riesgo de TI (RE) y respuesta al riesgo de TI (RR).',
        example: 'Un gerente de riesgos usa RISK IT — dominio RE — para evaluar si la vulnerabilidad detectada en el servidor de correos representa un riesgo alto o tolerable para el negocio.',
      },
      {
        term: 'MAGERIT v3',
        definition: 'Metodología española de análisis y gestión de riesgos de los sistemas de información. Utiliza un enfoque de activos → amenazas → vulnerabilidades → impacto para calcular el riesgo residual y seleccionar salvaguardas.',
        example: 'Una entidad pública española usa MAGERIT para catalogar sus activos (servidores, base de datos de ciudadanos), identificar la amenaza de acceso no autorizado y seleccionar salvaguardas de control de acceso.',
      },
      {
        term: 'CRISC',
        definition: 'Certified in Risk and Information Systems Control. Certificación de ISACA para profesionales que identifican y gestionan riesgos de TI. Es considerada una de las certificaciones TI con mayor retorno salarial a nivel mundial.',
        example: 'Un profesional CRISC lidera el comité de riesgos de TI de una aseguradora y certifica ante la junta directiva que el nivel de riesgo residual está dentro del apetito de riesgo aprobado.',
      },
    ],
  },

];