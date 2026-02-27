// ═══════════════════════════════════════════════════════
//  DATOS DEL JUEGO — El Concepto Infiltrado
//  Basado en: Valencia et al. (2016) & Libro Auditoría TI
// ═══════════════════════════════════════════════════════

export const CHAPTERS = [
  {
    id: 'riesgos-ti',
    num: '01',
    name: 'Gobierno y Gestión de Riesgos de TI',
    description: 'Marcos, metodologías y triada CIA',
    rounds: [
      {
        id: 'r1-metodologias',
        topic: 'Metodologías de Gestión de Riesgos de TIC',
        concepts: [
          {
            id: 'risk-it',
            name: 'RISK IT',
            definition: 'Marco de ISACA basado en principios y procesos para gestionar riesgos de TI, complemento de COBIT.',
            fake: false,
          },
          {
            id: 'magerit',
            name: 'MAGERIT v3',
            definition: 'Metodología de Análisis y Gestión de Riesgos de los Sistemas de Información, usada en la Administración Pública Española.',
            fake: false,
          },
          {
            id: 'octave',
            name: 'OCTAVE',
            definition: 'Operationally Critical Threat, Asset and Vulnerability Evaluation. Colección de técnicas del SEI de Carnegie Mellon.',
            fake: false,
          },
          {
            id: 'mehari',
            name: 'MEHARI',
            definition: 'Method for Harmonized Analysis of Risk. Desarrollado por CLUSIF (Club de Seguridad de la Información de Francia) desde 1996.',
            fake: false,
          },
          {
            id: 'cramm',
            name: 'CRAMM',
            definition: 'CCTA Risk Analysis and Management Method. Metodología del gobierno del Reino Unido desde 1987.',
            fake: false,
          },
          {
            id: 'isareg',
            name: 'ISAREG 360°',
            definition: 'Integrated Security Assurance and Risk Evaluation Guidelines. Estándar ISO/TC 45 para entornos digitales distribuidos.',
            fake: true,
          },
        ],
      },
      {
        id: 'r1-cobit',
        topic: 'Procesos de Riesgo en COBIT 5.0',
        concepts: [
          {
            id: 'edm03',
            name: 'EDM03',
            definition: 'Asegurar la optimización del riesgo. Proceso de gobierno que identifica y gestiona el riesgo del valor empresarial asociado al uso de TI.',
            fake: false,
          },
          {
            id: 'apo12',
            name: 'APO12',
            definition: 'Gestionar el riesgo. Proceso de gestión para identificar, evaluar y reducir los riesgos de TI dentro de niveles tolerables.',
            fake: false,
          },
          {
            id: 'apo1203',
            name: 'APO12.03',
            definition: 'Mantener un perfil de riesgo. Inventario del riesgo conocido con sus atributos: frecuencia esperada, impacto potencial y respuestas.',
            fake: false,
          },
          {
            id: 'apo1206',
            name: 'APO12.06',
            definition: 'Responder al riesgo. Implementar medidas efectivas de forma oportuna para limitar pérdidas ante eventos relacionados con TI.',
            fake: false,
          },
          {
            id: 'edm0301',
            name: 'EDM03.01',
            definition: 'Evaluar la gestión de riesgos. Examinar continuamente el efecto del riesgo sobre el uso actual y futuro de las TI.',
            fake: false,
          },
          {
            id: 'apo1207',
            name: 'APO12.07',
            definition: 'Definir un presupuesto de riesgos tecnológicos y asignarlo proporcionalmente por unidad de negocio según su exposición.',
            fake: true,
          },
        ],
      },
      {
        id: 'r1-cia',
        topic: 'La Triada CIA de Seguridad',
        concepts: [
          {
            id: 'confidencialidad',
            name: 'Confidencialidad',
            definition: 'Propiedad de que la información no esté disponible o revelada a individuos, entidades o procesos no autorizados (ISO/IEC 27000).',
            fake: false,
          },
          {
            id: 'integridad',
            name: 'Integridad',
            definition: 'Propiedad de exactitud y completitud de la información. Salvaguarda ante modificación o destrucción no autorizada.',
            fake: false,
          },
          {
            id: 'disponibilidad',
            name: 'Disponibilidad',
            definition: 'Propiedad de ser accesible y utilizable a petición de una entidad autorizada cuando lo requieran los procesos de negocio.',
            fake: false,
          },
          {
            id: 'no-repudio',
            name: 'No repudio',
            definition: 'Atributo complementario a la triada CIA que impide negar haber realizado una determinada acción sobre la información.',
            fake: false,
          },
          {
            id: 'autenticidad',
            name: 'Autenticidad',
            definition: 'Atributo que complementa la triada CIA, garantizando que la identidad de quien actúa sobre la información es verificable.',
            fake: false,
          },
          {
            id: 'trazabilidad-activa',
            name: 'Trazabilidad Activa',
            definition: 'Capacidad de registrar y auditar en tiempo real todas las rutas de acceso a activos de información según protocolo COBIT 5-TA.',
            fake: true,
          },
        ],
      },
    ],
    // Para la pantalla final de aprendizaje
    glossary: [
      {
        term: 'GgRTIC',
        definition: 'Gobierno y Gestión de Riesgos de Tecnologías de Información y Comunicaciones. Sistema para dirigir y controlar incertidumbres que generan las TIC en la organización.',
        example: 'Una empresa bancaria implementa GgRTIC para decidir qué amenazas cibernéticas priorizar y cuánto invertir en controles.',
      },
      {
        term: 'Triada CIA',
        definition: 'Confidencialidad, Integridad y Disponibilidad. Los tres pilares para medir el impacto de cualquier riesgo tecnológico sobre la información.',
        example: 'Un ransomware ataca las 3: cifra los archivos (confidencialidad), los modifica (integridad) y los hace inaccesibles (disponibilidad).',
      },
      {
        term: 'COBIT 5.0',
        definition: 'Marco de referencia de ISACA para el gobierno y gestión de TI. Establece procesos como APO12 (gestionar riesgo) y EDM03 (optimizar riesgo).',
        example: 'Un auditor usa APO12.03 para mantener un registro actualizado de todos los riesgos identificados en los servidores de la empresa.',
      },
      {
        term: 'IT GRC',
        definition: 'Information Technology Governance, Risk and Compliance. Subconjunto del GRC corporativo que integra gobierno de TI, riesgos de TI y cumplimiento normativo de TI.',
        example: 'El área de TI de una entidad pública implementa IT GRC para alinear sus controles con el cumplimiento de la Ley de Habeas Data.',
      },
      {
        term: 'Activos Tecnológicos (12 capas)',
        definition: 'Modelo de clasificación de activos TIC en 12 capas interdependientes: desde Procesos de Negocio hasta Energía, pasando por datos, aplicaciones, servidores y redes.',
        example: 'Un corte de energía (capa 12) puede paralizar los servidores (capa 9), que tumban las aplicaciones (capa 4), afectando los procesos de negocio (capa 1). Efecto dominó.',
      },
      {
        term: 'CRISC',
        definition: 'Certified in Risk and Information Systems Control. Certificación de ISACA considerada la mejor pagada en TI. Requiere 3 años de experiencia en al menos 3 dominios.',
        example: 'Un profesional con CRISC puede liderar el proceso de gestión de riesgos de TI de un banco o una aseguradora.',
      },
    ],
  },
  {
    id: 'aseguramiento',
    num: '02',
    name: 'Aseguramiento y Auditoría de TI',
    description: 'GRC, líneas de defensa y campos de actuación',
    rounds: [
      {
        id: 'r2-aseguramiento',
        topic: 'Marcos de Aseguramiento Organizacional',
        concepts: [
          {
            id: 'grc',
            name: 'GRC',
            definition: 'Governance, Risk and Compliance. Marco del OCEG (2008) que integra gobierno corporativo, gestión de riesgos y cumplimiento para unificar criterios.',
            fake: false,
          },
          {
            id: '3lod',
            name: 'Modelo 3LoD',
            definition: 'Three Lines of Defense. Establece 3 líneas: gerencia (1ª), áreas especializadas de control (2ª) y auditoría interna independiente (3ª).',
            fake: false,
          },
          {
            id: 'aseg-combinado',
            name: 'Aseguramiento Combinado',
            definition: 'Alternativa para integrar información de diferentes actores de aseguramiento (internos y externos) y evitar duplicación de esfuerzos.',
            fake: false,
          },
          {
            id: 'mapa-aseg',
            name: 'Mapa de Aseguramiento',
            definition: 'Herramienta diseñada para coordinar adecuadamente a los diferentes actores internos y externos relacionados con la función de aseguramiento.',
            fake: false,
          },
          {
            id: 'iia-2050',
            name: 'Estándar IIA 2050',
            definition: 'Consejo para la práctica sobre coordinación. El director ejecutivo de auditoría debe compartir información con otros proveedores de aseguramiento.',
            fake: false,
          },
          {
            id: '4lod-tech',
            name: '4LoD-Tech',
            definition: 'Fourth Line of Digital Defense. Estándar IIA (2019) específico para entornos cloud y ciberseguridad, complementa el modelo 3LoD en contextos digitales.',
            fake: true,
          },
        ],
      },
      {
        id: 'r2-itgrc',
        topic: 'IT GRC y Aseguramiento Tecnológico',
        concepts: [
          {
            id: 'gov-tic',
            name: 'Gobierno corporativo de TIC',
            definition: 'Responsabilidad del comité de dirección. Liderazgo, estructura y procesos que aseguran que las TIC sostengan la estrategia organizacional.',
            fake: false,
          },
          {
            id: 'gestion-riesgos-tic',
            name: 'Gestión de riesgos de TIC',
            definition: 'Proceso de identificar, analizar, evaluar y definir planes de tratamiento de amenazas que pueden impactar recursos tecnológicos o información.',
            fake: false,
          },
          {
            id: 'cumplimiento-tic',
            name: 'Cumplimiento normativo de TIC',
            definition: 'Normas internas y externas que debe cumplir TI: Habeas Data, derechos de autor, ISO/IEC 20000, ISO/IEC 27001, ISO/IEC 12207.',
            fake: false,
          },
          {
            id: 'cobit5-aseg',
            name: 'COBIT 5 para Aseguramiento',
            definition: 'Guía profesional que orienta cómo usar COBIT 5 para apoyar actividades de aseguramiento de TIC en la organización.',
            fake: false,
          },
          {
            id: 'control-interno-tec',
            name: 'Control Interno Tecnológico',
            definition: 'Sistema de control (modelo COBIT) para verificar que todas las actividades de los sistemas de información cumplan procedimientos y estándares establecidos.',
            fake: false,
          },
          {
            id: 'pad',
            name: 'Protocolo PAD',
            definition: 'Protocolo de Aseguramiento Dual. Mecanismo que combina auditoría interna y externa para validar controles tecnológicos de forma simultánea y vinculante.',
            fake: true,
          },
        ],
      },
      {
        id: 'r2-campos',
        topic: 'Campos de Actuación del Aseguramiento TI',
        concepts: [
          {
            id: 'sgsi',
            name: 'SGSI (ISO/IEC 27001)',
            definition: 'Sistema de Gestión de Seguridad de la Información. Preserva confidencialidad, integridad y disponibilidad mediante gestión del riesgo.',
            fake: false,
          },
          {
            id: 'seg-informatica',
            name: 'Seguridad Informática',
            definition: 'Conjunto de procedimientos, dispositivos y herramientas para asegurar integridad, disponibilidad y privacidad en sistemas informáticos.',
            fake: false,
          },
          {
            id: 'comp-forense',
            name: 'Computación Forense',
            definition: 'Disciplina que descubre e interpreta información en medios informáticos para establecer hechos y formular hipótesis relacionadas con casos (Cano, 2009).',
            fake: false,
          },
          {
            id: 'auditoria-sistemas',
            name: 'Auditoría de Sistemas',
            definition: 'Función de aseguramiento que recolecta y evalúa evidencia para determinar si los controles de TIC son eficaces y eficientes.',
            fake: false,
          },
          {
            id: 'control-interno-inf',
            name: 'Control Interno Informático',
            definition: 'Sistema de control que verifica diariamente que las actividades de los sistemas de información cumplan procedimientos organizacionales.',
            fake: false,
          },
          {
            id: 'apa',
            name: 'Auditoría Predictiva Algorítmica',
            definition: 'Uso de modelos de inteligencia artificial para anticipar hallazgos de auditoría antes de ejecutar pruebas sustantivas en sistemas de información.',
            fake: true,
          },
        ],
      },
    ],
    glossary: [
      {
        term: 'Aseguramiento',
        definition: 'Función organizacional diseñada para mejorar el grado de confianza sobre un asunto particular. Integra riesgos, control y auditoría (Tríada del Aseguramiento).',
        example: 'El área de auditoría interna de una empresa da "aseguramiento" al consejo directivo de que los controles de TI funcionan correctamente.',
      },
      {
        term: 'Modelo 3LoD',
        definition: 'Three Lines of Defense. La gerencia opera (1ª línea), áreas especializadas controlan (2ª línea), y auditoría interna evalúa de forma independiente (3ª línea).',
        example: 'En un banco: el área de TI gestiona el riesgo diario (1ª), el área de seguridad supervisa los controles (2ª), y los auditores internos verifican todo (3ª).',
      },
      {
        term: 'GRC',
        definition: 'Governance, Risk and Compliance. Marco integrador del gobierno corporativo, gestión de riesgos y cumplimiento normativo en una sola visión.',
        example: 'Una empresa implementa GRC para que el área de riesgos, el área legal y la junta directiva hablen el mismo idioma al evaluar amenazas.',
      },
      {
        term: 'IT GRC',
        definition: 'Subconjunto del GRC aplicado a TI. Integra gobierno de TIC, riesgos de TIC y cumplimiento normativo de TIC de forma integrada.',
        example: 'El CISO de una empresa usa IT GRC para alinear su estrategia de ciberseguridad con las normas ISO 27001 y los objetivos del negocio.',
      },
      {
        term: 'Auditoría de Sistemas',
        definition: 'Recolecta y evalúa evidencia para determinar si los controles de TIC son eficaces y eficientes para proteger el cumplimiento de objetivos organizacionales.',
        example: 'Un auditor revisa si los accesos al sistema de nómina están bien controlados y solo las personas autorizadas pueden modificar salarios.',
      },
      {
        term: 'Computación Forense',
        definition: 'Disciplina que preserva, recolecta, valida e interpreta evidencias digitales para reconstruir hechos delictivos o incidentes de seguridad.',
        example: 'Tras un fraude bancario, un experto forense analiza los logs del sistema para rastrear qué usuario modificó las transacciones y desde qué equipo.',
      },
    ],
  },
];
