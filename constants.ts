
import { Module } from './types';

export const COURSE_MODULES: Module[] = [
  {
    id: 1,
    title: "FUNDAMENTOS DA ELÉTRICA",
    description: "Domine os conceitos básicos que sustentam todo o sistema elétrico automotivo moderno.",
    topics: ["Grandezas Elétricas", "Lei de Ohm", "Circuitos Série e Paralelo", "Multímetro Digital"],
    icon: "Zap"
  },
  {
    id: 2,
    title: "SISTEMA DE CARGA E PARTIDA",
    description: "Aprenda a diagnosticar e reparar alternadores, baterias e motores de arranque.",
    topics: ["Testes de Bateria", "Manutenção de Alternador", "Relés e Fusíveis", "Motor de Partida"],
    icon: "Battery"
  },
  {
    id: 3,
    title: "INJEÇÃO ELETRÔNICA E SENSORES",
    description: "O coração do carro moderno. Entenda o funcionamento de sensores e atuadores.",
    topics: ["Sensores de Temperatura", "Sonda Lambda", "Eletroinjetores", "Corpo de Borboleta"],
    icon: "Cpu"
  },
  {
    id: 4,
    title: "ILUMINAÇÃO E CONFORTO",
    description: "Sistemas de faróis, setas, travas elétricas, vidros e som automotivo.",
    topics: ["Faróis de LED e Xenon", "Travas e Alarmes", "Vidros Elétricos", "Acessórios Modernos"],
    icon: "Lightbulb"
  },
  {
    id: 5,
    title: "DIAGNÓSTICO AVANÇADO",
    description: "Utilize osciloscópios e scanners para encontrar falhas complexas em segundos.",
    topics: ["Uso de Scanner", "Leitura de Osciloscópio", "Análise de Redes CAN", "Checklist de Falhas"],
    icon: "Activity"
  },
  {
    id: 6,
    title: "VEÍCULOS HÍBRIDOS E ELÉTRICOS",
    description: "Prepare-se para o futuro. Entenda a arquitetura de alta tensão e segurança em EVs.",
    topics: ["Baterias de Lítio", "Inversores de Frequência", "Segurança em Alta Tensão", "Motores de Tração"],
    icon: "Zap"
  },
  {
    id: 7,
    title: "AR CONDICIONADO DIGITAL",
    description: "Manutenção e diagnóstico em sistemas de climatização com controle eletrônico.",
    topics: ["Carga de Gás", "Compressores Variáveis", "Sensores de Pressão", "Atuadores de Mistura"],
    icon: "Zap"
  },
  {
    id: 8,
    title: "SEGURANÇA PASSIVA (AIRBAG/ABS)",
    description: "Sistemas de segurança crítica: diagnóstico e substituição de componentes.",
    topics: ["Sensores de Impacto", "Módulos de Airbag", "Sensores de Roda ABS", "Bomba Hidráulica"],
    icon: "ShieldCheck"
  },
  {
    id: 9,
    title: "REDES VEICULARES (CAN/LIN)",
    description: "A linguagem dos módulos. Como identificar falhas de comunicação em redes digitais.",
    topics: ["Arquitetura CAN Bus", "Protocolo LIN", "Diagnóstico de Rede", "Gateways"],
    icon: "Cpu"
  },
  {
    id: 10,
    title: "SISTEMAS DE CONFORTO AVANÇADO",
    description: "Programação de chaves, sistemas Keyless e espelhamento multimídia original.",
    topics: ["Imobilizadores", "Sistemas Keyless", "Rede de Entretenimento", "Módulos de Conforto"],
    icon: "Lock"
  },
  {
    id: 11,
    title: "TELEMETRIA E RASTREAMENTO",
    description: "Instalação e configuração de sistemas de gestão de frota e segurança remota.",
    topics: ["GPS e GSM", "Corte de Combustível", "Integração com OBDII", "Configuração de APN"],
    icon: "Activity"
  },
  {
    id: 12,
    title: "GESTÃO DE OFICINA ELÉTRICA",
    description: "Como organizar o fluxo de trabalho e precificar serviços de alta tecnologia.",
    topics: ["Orçamentação Técnica", "Garantia de Serviços", "Organização de Bancada", "Atendimento Premium"],
    icon: "Award"
  },
  {
    id: 13,
    title: "REPARO DE MÓDULOS ECU",
    description: "Técnicas de soldagem e identificação de componentes internos em centrais eletrônicas.",
    topics: ["Solda em SMD", "Identificação de Drivers", "Mapeamento de Pinos", "Reguladores de Tensão"],
    icon: "Cpu"
  },
  {
    id: 14,
    title: "SISTEMAS DE SOM HIGH-END",
    description: "Projetos de áudio de alta fidelidade e integração com centrais originais.",
    topics: ["Processadores DSP", "Tratamento Acústico", "Alinhamento de Fase", "Cálculo de Caixas"],
    icon: "Lightbulb"
  },
  {
    id: 15,
    title: "SENSORES DE MANOBRA E VISÃO",
    description: "Instalação e calibração de câmeras 360 e radares de proximidade.",
    topics: ["Câmeras de Ré", "Radares de Ponto Cego", "Calibração ADAS", "Sensores Ultrassom"],
    icon: "Activity"
  },
  {
    id: 16,
    title: "PERFORMANCE E CHIP TUNING",
    description: "Introdução à reprogramação de mapas para ganho de potência e economia.",
    topics: ["Leitura de EPROM", "Mapas de Injeção", "Limitadores de Torque", "Ferramentas de Escrita"],
    icon: "Zap"
  },
  {
    id: 17,
    title: "ELÉTRICA DE MOTOCICLETAS",
    description: "Particularidades dos sistemas elétricos em motos de baixa e alta cilindrada.",
    topics: ["Estatores e Retificadores", "Sensores de Inclinação", "Ignição Eletrônica", "Baterias de Gel"],
    icon: "Battery"
  },
  {
    id: 18,
    title: "LABORATÓRIO DE DEFEITOS",
    description: "Prática intensa com defeitos colocados para testar sua velocidade de diagnóstico.",
    topics: ["Casos Reais", "Pressão de Tempo", "Uso de Diagramas", "Entrega Técnica"],
    icon: "BookOpen"
  }
];
