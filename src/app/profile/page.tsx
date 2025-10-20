// src/app/profile/page.tsx
"use client";

import { useState, useRef } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import {
  User,
  CreditCard,
  RefreshCw,
  CheckCircle,
  AlertCircle,
  Eye,
  EyeOff,
  Calendar,
  DollarSign,
  UserCheck,
  Mail,
  BadgeCheck,
  Star,
  Award,
  Clock,
  ShieldCheck,
  MapPin,
  Phone,
  FileText,
  Smile,
  ThumbsUp,
  TrendingUp as TrendUp,
  Users,
  Heart,
  Crown,
  Medal,
  Gem,
  Key,
  Database,
  Cpu,
  LucideIcon,
} from "lucide-react";
import Button from "@/components/ui/button";
import StarRating from "@/components/ui/star-rating-novo";
import { VerificationStepProps, BadgeIconProps } from "@/lib/types";
import { cn } from "@/lib/utils";

// Dados mockados premium
const mockUser = {
  id: "1",
  name: "Carlos Eduardo Silva",
  email: "carlos.silva@email.com",
  phone: "+55 (11) 98765-4321",
  memberSince: "2022-03-15",
  lastActive: new Date().toISOString(),
  totalTransactions: 127,
  successfulTransactions: 124,
  totalMilesSold: 2850000,
  totalMilesBought: 420000,
  rating: 4.9,
  verification: {
    identity: true,
    address: true,
    phone: true,
    facial: true,
    document: true,
    completed: true,
  },
  level: {
    level: "expert" as const,
    points: 985,
    nextLevel: 1000,
    progress: 98.5,
  },
  badges: [
    {
      id: "1",
      name: "Vendedor Premium",
      description: "Top 5% de vendedores da plataforma",
      icon: "crown",
      color: "from-yellow-400 to-yellow-600",
      achievedAt: "2023-11-20",
    },
    {
      id: "2",
      name: "Negociador Expert",
      description: "Mais de 100 transações realizadas",
      icon: "award",
      color: "from-purple-500 to-purple-700",
      achievedAt: "2023-09-15",
    },
    {
      id: "3",
      name: "Atendimento 5 Estrelas",
      description: "Avaliação perfeita por 3 meses consecutivos",
      icon: "star",
      color: "from-blue-500 to-blue-700",
      achievedAt: "2023-12-01",
    },
  ],
  testimonials: [
    {
      id: "1",
      author: "Mariana Costa",
      rating: 5,
      comment:
        "Transação super rápida e segura! Carlos é muito profissional e atencioso. Recomendo muito!",
      date: "2024-01-15",
      transactionValue: 50000,
      verified: true,
    },
    {
      id: "2",
      author: "Roberto Santos",
      rating: 5,
      comment:
        "Melhor experiência de compra de milhas que já tive. Processo transparente e eficiente.",
      date: "2024-01-10",
      transactionValue: 75000,
      verified: true,
    },
    {
      id: "3",
      author: "Ana Paula Lima",
      rating: 5,
      comment:
        "Vendedor confiável e com ótimo preço. Já fiz várias transações e sempre tudo perfeito!",
      date: "2024-01-08",
      transactionValue: 120000,
      verified: true,
    },
  ],
  quickStats: [
    {
      label: "Taxa de Sucesso",
      value: "97.6%",
      change: "+2.1%",
      trend: "up" as const,
    },
    {
      label: "Tempo Médio",
      value: "15min",
      change: "-3min",
      trend: "up" as const,
    },
    {
      label: "Clientes Satisfeitos",
      value: "98%",
      change: "+1.5%",
      trend: "up" as const,
    },
    {
      label: "Transações/Mês",
      value: "28",
      change: "+4",
      trend: "up" as const,
    },
  ],
};

const mockLoyaltyPrograms = [
  {
    id: "1",
    name: "LATAM Pass",
    program: "latam",
    totalMiles: 154200,
    lastUpdate: new Date().toISOString(),
    connected: false,
    transactions: [
      {
        id: "1",
        date: "2024-01-15",
        description: "Venda para Mariana Costa",
        miles: -50000,
        type: "transfer",
        buyer: "Mariana Costa",
      },
      {
        id: "2",
        date: "2024-01-10",
        description: "Acúmulo por voo",
        miles: 2500,
        type: "earned",
        partner: "LATAM Airlines",
      },
    ],
  },
  {
    id: "2",
    name: "Smiles",
    program: "gol",
    totalMiles: 89200,
    lastUpdate: new Date().toISOString(),
    connected: true,
    transactions: [
      {
        id: "1",
        date: "2024-01-12",
        description: "Venda para Roberto Santos",
        miles: -35000,
        type: "transfer",
        buyer: "Roberto Santos",
      },
    ],
  },
  {
    id: "3",
    name: "TudoAzul",
    program: "azul",
    totalMiles: 45600,
    lastUpdate: new Date().toISOString(),
    connected: false,
    transactions: [],
  },
];

// Componentes auxiliares
const VerificationStep = ({
  completed,
  label,
  description,
  icon: Icon,
}: VerificationStepProps) => (
  <motion.div
    initial={{ opacity: 0, x: -20 }}
    animate={{ opacity: 1, x: 0 }}
    whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
    className={cn(
      "flex items-start gap-4 p-4 rounded-2xl border-2 transition-all duration-300 cursor-pointer group",
      completed
        ? "bg-gradient-to-r from-green-50 to-emerald-50 border-green-200 shadow-lg shadow-green-500/10 hover:shadow-xl hover:shadow-green-500/20"
        : "bg-gradient-to-r from-gray-50 to-slate-50 border-gray-200 hover:border-gray-300"
    )}
  >
    <div
      className={cn(
        "flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300 group-hover:scale-110",
        completed
          ? "bg-gradient-to-br from-green-500 to-emerald-600 text-white shadow-lg shadow-green-500/25"
          : "bg-gray-300 text-gray-600"
      )}
    >
      <Icon className="w-6 h-6" />
    </div>
    <div className="flex-1 min-w-0">
      <h4
        className={cn(
          "font-semibold text-lg mb-1 transition-colors duration-300",
          completed ? "text-green-800" : "text-gray-600"
        )}
      >
        {label}
      </h4>
      <p
        className={cn(
          "text-sm transition-colors duration-300",
          completed ? "text-green-600" : "text-gray-500"
        )}
      >
        {description}
      </p>
    </div>
    <div
      className={cn(
        "flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center transition-all duration-300 group-hover:scale-110",
        completed
          ? "bg-green-500 text-white shadow-lg shadow-green-500/25"
          : "bg-gray-300"
      )}
    >
      {completed && <CheckCircle className="w-4 h-4" />}
    </div>
  </motion.div>
);

const BadgeIcon = ({ icon, color }: BadgeIconProps) => {
  const icons: Record<string, LucideIcon> = {
    crown: Crown,
    award: Award,
    star: Star,
    medal: Medal,
    gem: Gem,
  };

  const IconComponent = icons[icon] || Award;

  return (
    <motion.div
      whileHover={{ scale: 1.05, rotate: 2 }}
      className={cn(
        "w-16 h-16 rounded-2xl flex items-center justify-center bg-gradient-to-br shadow-lg transition-all duration-300",
        color
      )}
    >
      <IconComponent className="w-8 h-8 text-white" />
    </motion.div>
  );
};

export default function ProfilePage() {
  const [user] = useState(mockUser);
  const [programs, setPrograms] = useState(mockLoyaltyPrograms);
  const [syncingProgram, setSyncingProgram] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState<{ [key: string]: boolean }>(
    {}
  );
  const [credentials, setCredentials] = useState<{
    [key: string]: { username: string; password: string };
  }>({});
  const [syncStatus, setSyncStatus] = useState<{
    programId: string | null;
    message: string;
    type: "info" | "success" | "error";
  }>({
    programId: null,
    message: "",
    type: "info",
  });
  const [currentStep, setCurrentStep] = useState<{ [key: string]: number }>({});
  const statusRef = useRef<HTMLDivElement>(null);

  // Funções para programas de milhas
  const togglePasswordVisibility = (programId: string) => {
    setShowPassword((prev) => ({
      ...prev,
      [programId]: !prev[programId],
    }));
  };

  const handleCredentialChange = (
    programId: string,
    field: string,
    value: string
  ) => {
    setCredentials((prev) => ({
      ...prev,
      [programId]: {
        ...prev[programId],
        [field]: value,
      },
    }));
  };

  const showStatusMessage = (
    programId: string,
    message: string,
    type: "info" | "success" | "error" = "info"
  ) => {
    setSyncStatus({ programId, message, type });
  };

  const updateSyncProgress = (
    programId: string,
    step: number,
    message: string
  ) => {
    setCurrentStep((prev) => ({ ...prev, [programId]: step }));
    showStatusMessage(programId, message, "info");
  };

  const syncProgram = async (programId: string) => {
    const program = programs.find((p) => p.id === programId);
    if (!program) return;

    setSyncingProgram(programId);
    setCurrentStep((prev) => ({ ...prev, [programId]: 0 }));

    try {
      if (programId === "1") {
        // LATAM - Processo com etapas detalhadas
        const programCreds = credentials[programId];

        if (!programCreds?.username || !programCreds?.password) {
          showStatusMessage(
            programId,
            "❌ Credenciais não encontradas",
            "error"
          );
          setSyncingProgram(null);
          return;
        }

        const syncSteps = [
          { message: "🚀 Iniciando sincronização...", delay: 500 },
          { message: "🔐 Conectando com LATAM Pass...", delay: 800 },
          { message: "🔑 Autenticando credenciais...", delay: 600 },
          { message: "📡 Estabelecendo comunicação segura...", delay: 700 },
          { message: "📊 Obtendo saldo de milhas...", delay: 1000 },
        ];

        // Executa etapas de progresso
        for (let i = 0; i < syncSteps.length; i++) {
          updateSyncProgress(programId, i, syncSteps[i].message);
          await new Promise((resolve) =>
            setTimeout(resolve, syncSteps[i].delay)
          );
        }

        const response = await fetch("/api/latam/sync", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            username: programCreds.username,
            password: programCreds.password,
          }),
        });

        const result = await response.json();

        if (result.success) {
          setPrograms((prev) =>
            prev.map((p) =>
              p.id === programId
                ? {
                    ...p,
                    totalMiles: result.miles,
                    lastUpdate: new Date().toISOString(),
                    connected: true,
                  }
                : p
            )
          );

          showStatusMessage(
            programId,
            `✅ ${result.message} | ${result.miles.toLocaleString(
              "pt-BR"
            )} milhas`,
            "success"
          );
        } else {
          showStatusMessage(programId, `❌ ${result.message}`, "error");
        }
      } else {
        // Outros programas - Mock com progresso
        const mockSteps = [
          { message: "🔄 Conectando com o programa...", delay: 800 },
          { message: "🔑 Verificando credenciais...", delay: 600 },
          { message: "📊 Sincronizando dados...", delay: 800 },
        ];

        for (let i = 0; i < mockSteps.length; i++) {
          updateSyncProgress(programId, i, mockSteps[i].message);
          await new Promise((resolve) =>
            setTimeout(resolve, mockSteps[i].delay)
          );
        }

        const newMiles = program.totalMiles + Math.floor(Math.random() * 1000);
        setPrograms((prev) =>
          prev.map((p) =>
            p.id === programId
              ? {
                  ...p,
                  totalMiles: newMiles,
                  lastUpdate: new Date().toISOString(),
                }
              : p
          )
        );

        showStatusMessage(
          programId,
          `✅ Sincronização concluída! ${newMiles.toLocaleString(
            "pt-BR"
          )} milhas`,
          "success"
        );
      }
    } catch (error) {
      console.error("Erro ao sincronizar:", error);
      showStatusMessage(
        programId,
        "❌ Erro de conexão. Tente novamente.",
        "error"
      );
    } finally {
      setTimeout(() => {
        setSyncingProgram(null);
        setCurrentStep((prev) => ({ ...prev, [programId]: 0 }));
      }, 2000);
    }
  };

  const connectProgram = async (programId: string) => {
    const programCreds = credentials[programId];
    if (!programCreds?.username || !programCreds?.password) {
      showStatusMessage(programId, "❌ Preencha usuário e senha", "error");
      return;
    }

    setSyncingProgram(programId);
    setCurrentStep((prev) => ({ ...prev, [programId]: 0 }));

    try {
      if (programId === "1") {
        const connectSteps = [
          { message: "🔐 Iniciando processo de conexão...", delay: 500 },
          { message: "🔑 Validando credenciais...", delay: 700 },
          { message: "🔄 Conectando com LATAM Pass...", delay: 800 },
          { message: "📡 Estabelecendo comunicação...", delay: 600 },
        ];

        for (let i = 0; i < connectSteps.length; i++) {
          updateSyncProgress(programId, i, connectSteps[i].message);
          await new Promise((resolve) =>
            setTimeout(resolve, connectSteps[i].delay)
          );
        }

        const response = await fetch("/api/latam/sync", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            username: programCreds.username,
            password: programCreds.password,
          }),
        });

        const result = await response.json();

        if (result.success) {
          setPrograms((prev) =>
            prev.map((p) =>
              p.id === programId
                ? {
                    ...p,
                    connected: true,
                    totalMiles: result.miles,
                    lastUpdate: new Date().toISOString(),
                  }
                : p
            )
          );

          showStatusMessage(
            programId,
            `✅ ${result.message} | ${result.miles.toLocaleString(
              "pt-BR"
            )} milhas`,
            "success"
          );
        } else {
          showStatusMessage(programId, `❌ ${result.message}`, "error");
        }
      } else {
        const mockSteps = [
          { message: "🔑 Verificando credenciais...", delay: 600 },
          { message: "🔄 Conectando com o servidor...", delay: 700 },
          { message: "📊 Sincronizando dados...", delay: 500 },
        ];

        for (let i = 0; i < mockSteps.length; i++) {
          updateSyncProgress(programId, i, mockSteps[i].message);
          await new Promise((resolve) =>
            setTimeout(resolve, mockSteps[i].delay)
          );
        }

        const mockMiles = 1000 + Math.floor(Math.random() * 5000);
        setPrograms((prev) =>
          prev.map((p) =>
            p.id === programId
              ? {
                  ...p,
                  connected: true,
                  totalMiles: mockMiles,
                  lastUpdate: new Date().toISOString(),
                }
              : p
          )
        );

        showStatusMessage(
          programId,
          `✅ Conectado com sucesso! ${mockMiles.toLocaleString(
            "pt-BR"
          )} milhas`,
          "success"
        );
      }
    } catch (error) {
      console.error("Erro ao conectar:", error);
      showStatusMessage(programId, "❌ Erro de conexão", "error");
    } finally {
      setTimeout(() => {
        setSyncingProgram(null);
        setCurrentStep((prev) => ({ ...prev, [programId]: 0 }));
      }, 2000);
    }
  };

  // Funções auxiliares
  const getProgramConfig = (program: string) => {
    const configs = {
      latam: {
        color: "bg-gradient-to-br from-red-50 to-red-100 border-red-200",
        hoverColor: "hover:border-red-300 hover:shadow-red-500/20",
        gradient: "from-red-500 to-red-600",
        name: "LATAM Pass",
        logo: "/images/latam-logo.png",
        icon: "🔴",
      },
      gol: {
        color:
          "bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200",
        hoverColor: "hover:border-orange-300 hover:shadow-orange-500/20",
        gradient: "from-orange-500 to-orange-600",
        name: "Smiles",
        logo: "/images/gol-logo.png",
        icon: "🟠",
      },
      azul: {
        color: "bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200",
        hoverColor: "hover:border-blue-300 hover:shadow-blue-500/20",
        gradient: "from-blue-500 to-blue-600",
        name: "TudoAzul",
        logo: "/images/azul-logo.png",
        icon: "🔵",
      },
    };
    return (
      configs[program as keyof typeof configs] || {
        color: "bg-gradient-to-br from-gray-50 to-gray-100 border-gray-200",
        hoverColor: "hover:border-gray-300",
        gradient: "from-gray-500 to-gray-600",
        name: "Programa",
        logo: "",
        icon: "✈️",
      }
    );
  };

  const getTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return "Agora mesmo";
    if (diffMins < 60) return `${diffMins} min atrás`;
    if (diffHours < 24) return `${diffHours}h atrás`;
    if (diffDays === 1) return "1 dia atrás";
    return `${diffDays} dias atrás`;
  };

  const getLevelConfig = (level: string) => {
    const configs = {
      iniciante: { color: "from-gray-400 to-gray-600", label: "Iniciante" },
      intermediário: {
        color: "from-blue-400 to-blue-600",
        label: "Intermediário",
      },
      avançado: { color: "from-purple-500 to-purple-700", label: "Avançado" },
      expert: { color: "from-yellow-400 to-orange-600", label: "Expert" },
    };
    return configs[level as keyof typeof configs] || configs.iniciante;
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "Nunca";
    return new Date(dateString).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatMiles = (miles: number) => {
    return miles.toLocaleString("pt-BR");
  };

  const getProgressPercentage = (programId: string, totalSteps: number = 4) => {
    const step = currentStep[programId] || 0;
    return Math.min((step / totalSteps) * 100, 85);
  };

  const verificationSteps = [
    {
      label: "Identidade",
      description: "Documento oficial com foto verificado",
      icon: UserCheck,
      completed: user.verification.identity,
    },
    {
      label: "Endereço",
      description: "Comprovante de residência validado",
      icon: MapPin,
      completed: user.verification.address,
    },
    {
      label: "Telefone",
      description: "Número verificado e ativo",
      icon: Phone,
      completed: user.verification.phone,
    },
    {
      label: "Reconhecimento Facial",
      description: "Biometria facial confirmada",
      icon: Smile,
      completed: user.verification.facial,
    },
    {
      label: "Documentação",
      description: "Documentos complementares analisados",
      icon: FileText,
      completed: user.verification.document,
    },
  ];

  const levelConfig = getLevelConfig(user.level.level);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-emerald-50/20 py-8">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Header Premium com Status de Atividade */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12 relative"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-3 bg-gradient-to-r from-[#317873] to-[#a0d6b4] text-white px-6 py-3 rounded-2xl text-sm font-semibold mb-6 shadow-lg"
          >
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span>
                Vendedor Verificado • Online {getTimeAgo(user.lastActive)}
              </span>
            </div>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-5xl md:text-7xl font-bold bg-gradient-to-br from-gray-900 via-[#317873] to-[#a0d6b4] bg-clip-text text-transparent mb-6 font-poppins leading-tight"
          >
            Meu Perfil
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed"
          >
            Conectando compradores e vendedores com segurança, transparência e
            excelência no mercado de milhas
          </motion.p>
        </motion.div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* Coluna da Esquerda - Informações Pessoais e Verificação */}
          <div className="xl:col-span-1 space-y-6">
            {/* Card de Perfil Premium */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              whileHover={{ y: -5 }}
              className="bg-white/90 backdrop-blur-xl rounded-3xl border border-white/20 shadow-2xl shadow-[#317873]/10 hover:shadow-3xl hover:shadow-[#317873]/20 transition-all duration-500 p-8"
            >
              <div className="text-center">
                <div className="relative inline-block mb-6">
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    className="w-32 h-32 bg-gradient-to-br from-[#317873] to-[#a0d6b4] rounded-3xl flex items-center justify-center text-white text-3xl font-bold mx-auto shadow-2xl relative overflow-hidden group"
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent"></div>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent"></div>
                    {user.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}

                    {/* Selo de Verificação */}
                    <motion.div
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      className="absolute -bottom-2 -right-2 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full p-2 shadow-2xl shadow-green-500/25 border-4 border-white"
                    >
                      <BadgeCheck className="w-6 h-6 text-white" />
                    </motion.div>
                  </motion.div>
                </div>

                <h2 className="text-2xl font-bold text-gray-900 mb-2 font-poppins">
                  {user.name} <BadgeCheck className="w-6 h-6 text-white" />
                </h2>

                <div className="flex items-center justify-center gap-3 mb-4">
                  <div className="flex items-center gap-1">
                    <StarRating rating={user.rating} size="sm" />
                    <span className="text-lg font-bold text-gray-900 ml-2">
                      {user.rating.toFixed(1)}
                    </span>
                  </div>
                  <span className="text-sm text-gray-500">
                    ({user.testimonials.length} avaliações)
                  </span>
                </div>

                {/* Nível do Vendedor */}
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className={cn(
                    "inline-flex items-center gap-2 px-4 py-2 rounded-2xl text-white font-semibold text-sm mb-6 bg-gradient-to-r shadow-lg cursor-pointer",
                    levelConfig.color
                  )}
                >
                  <Crown className="w-4 h-4" />
                  {levelConfig.label} • {user.level.points} pts
                </motion.div>
              </div>

              <div className="space-y-4">
                {[
                  { icon: Mail, label: "E-mail Verificado", value: user.email },
                  { icon: Phone, label: "Telefone", value: user.phone },
                  {
                    icon: Calendar,
                    label: "Membro desde",
                    value: new Date(user.memberSince).toLocaleDateString(
                      "pt-BR"
                    ),
                  },
                  {
                    icon: Users,
                    label: "Transações",
                    value: `${user.totalTransactions} realizadas`,
                  },
                ].map((item, index) => (
                  <motion.div
                    key={item.label}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 + index * 0.1 }}
                    whileHover={{ scale: 1.02, x: 5 }}
                    className="flex items-center gap-3 p-4 bg-gradient-to-r from-gray-50 to-white rounded-2xl border border-gray-100 hover:border-gray-200 transition-all duration-300 group"
                  >
                    <item.icon className="w-5 h-5 text-[#317873] flex-shrink-0" />
                    <div className="min-w-0 flex-1">
                      <div className="text-sm text-gray-600 font-medium">
                        {item.label}
                      </div>
                      <div className="font-semibold text-gray-900 truncate">
                        {item.value}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Processo de Verificação */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              whileHover={{ y: -5 }}
              className="bg-white/90 backdrop-blur-xl rounded-3xl border border-white/20 shadow-2xl shadow-green-500/10 hover:shadow-3xl hover:shadow-green-500/20 transition-all duration-500 p-6"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-green-100 rounded-xl">
                  <ShieldCheck className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 text-lg">
                    Verificação de Identidade
                  </h3>
                  <p className="text-sm text-gray-600">
                    Processo completo de validação
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                {verificationSteps.map((step, index) => (
                  <VerificationStep key={index} {...step} />
                ))}
              </div>

              {user.verification.completed && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="mt-4 p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl border border-green-200 text-center"
                >
                  <CheckCircle className="w-8 h-8 text-green-500 mx-auto mb-2" />
                  <div className="font-semibold text-green-800">
                    Identidade Totalmente Verificada
                  </div>
                  <div className="text-sm text-green-600">
                    Perfil 100% seguro e confiável
                  </div>
                </motion.div>
              )}
            </motion.div>

            {/* Badges e Conquistas */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              whileHover={{ y: -5 }}
              className="bg-white/90 backdrop-blur-xl rounded-3xl border border-white/20 shadow-2xl shadow-purple-500/10 hover:shadow-3xl hover:shadow-purple-500/20 transition-all duration-500 p-6"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-purple-100 rounded-xl">
                  <Award className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 text-lg">
                    Conquistas
                  </h3>
                  <p className="text-sm text-gray-600">
                    Badges e reconhecimentos
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                {user.badges.map((badge, index) => (
                  <motion.div
                    key={badge.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 * index }}
                    whileHover={{ scale: 1.02 }}
                    className="flex items-center gap-4 p-4 bg-gradient-to-r from-gray-50 to-white rounded-2xl border border-gray-100 hover:border-purple-200 transition-all duration-300"
                  >
                    <BadgeIcon icon={badge.icon} color={badge.color} />
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-gray-900 text-sm mb-1">
                        {badge.name}
                      </h4>
                      <p className="text-xs text-gray-600 leading-relaxed">
                        {badge.description}
                      </p>
                      <div className="text-xs text-gray-500 mt-1">
                        Conquistado em{" "}
                        {new Date(badge.achievedAt).toLocaleDateString("pt-BR")}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Coluna da Direita - Métricas, Programas e Depoimentos */}
          <div className="xl:col-span-2 space-y-6">
            {/* Métricas Rápidas */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="grid grid-cols-2 lg:grid-cols-4 gap-4"
            >
              {user.quickStats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.1 * index }}
                  whileHover={{
                    scale: 1.05,
                    y: -5,
                    transition: { duration: 0.2 },
                  }}
                  className="bg-white/90 backdrop-blur-xl rounded-2xl border border-white/20 p-6 shadow-lg shadow-blue-500/5 hover:shadow-xl hover:shadow-blue-500/10 transition-all duration-300 group cursor-pointer"
                >
                  <div className="text-2xl font-bold text-gray-900 mb-2 font-poppins group-hover:text-[#317873] transition-colors duration-300">
                    {stat.value}
                  </div>
                  <div className="text-sm text-gray-600 font-medium mb-1">
                    {stat.label}
                  </div>
                  <div
                    className={cn(
                      "flex items-center gap-1 text-xs font-semibold transition-colors duration-300",
                      stat.trend === "up"
                        ? "text-green-600"
                        : stat.trend === "down"
                        ? "text-red-600"
                        : "text-gray-500"
                    )}
                  >
                    {stat.trend === "up" && <TrendUp className="w-3 h-3" />}
                    {stat.change}
                  </div>
                </motion.div>
              ))}
            </motion.div>

            {/* Estatísticas Detalhadas */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              whileHover={{ y: -5 }}
              className="bg-white/90 backdrop-blur-xl rounded-3xl border border-white/20 shadow-2xl shadow-[#317873]/10 hover:shadow-3xl hover:shadow-[#317873]/20 transition-all duration-500 p-8"
            >
              <div className="flex items-center gap-3 mb-8">
                <div className="p-3 bg-blue-100 rounded-2xl">
                  <TrendUp className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 text-xl">
                    Estatísticas de Performance
                  </h3>
                  <p className="text-gray-600">
                    Métricas detalhadas do vendedor
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  {[
                    {
                      label: "Milhas Vendidas",
                      value: user.totalMilesSold.toLocaleString("pt-BR"),
                      icon: DollarSign,
                      color: "blue",
                    },
                    {
                      label: "Taxa de Sucesso",
                      value: `${(
                        (user.successfulTransactions / user.totalTransactions) *
                        100
                      ).toFixed(1)}%`,
                      icon: ThumbsUp,
                      color: "green",
                    },
                  ].map((stat, index) => (
                    <motion.div
                      key={stat.label}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 * index }}
                      whileHover={{ scale: 1.02 }}
                      className={cn(
                        "flex justify-between items-center p-4 rounded-2xl border transition-all duration-300",
                        stat.color === "blue"
                          ? "bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200 hover:border-blue-300"
                          : "bg-gradient-to-r from-green-50 to-emerald-50 border-green-200 hover:border-green-300"
                      )}
                    >
                      <div>
                        <div
                          className={cn(
                            "text-sm font-medium",
                            stat.color === "blue"
                              ? "text-blue-600"
                              : "text-green-600"
                          )}
                        >
                          {stat.label}
                        </div>
                        <div className="text-2xl font-bold text-gray-900">
                          {stat.value}
                        </div>
                      </div>
                      <stat.icon
                        className={cn(
                          "w-8 h-8",
                          stat.color === "blue"
                            ? "text-blue-500"
                            : "text-green-500"
                        )}
                      />
                    </motion.div>
                  ))}
                </div>

                <div className="space-y-4">
                  {[
                    {
                      label: "Milhas Compradas",
                      value: user.totalMilesBought.toLocaleString("pt-BR"),
                      icon: CreditCard,
                      color: "purple",
                    },
                    {
                      label: "Tempo na Plataforma",
                      value: `${Math.floor(
                        (new Date().getTime() -
                          new Date(user.memberSince).getTime()) /
                          (1000 * 60 * 60 * 24 * 30)
                      )} meses`,
                      icon: Clock,
                      color: "orange",
                    },
                  ].map((stat, index) => (
                    <motion.div
                      key={stat.label}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 * index }}
                      whileHover={{ scale: 1.02 }}
                      className={cn(
                        "flex justify-between items-center p-4 rounded-2xl border transition-all duration-300",
                        stat.color === "purple"
                          ? "bg-gradient-to-r from-purple-50 to-violet-50 border-purple-200 hover:border-purple-300"
                          : "bg-gradient-to-r from-orange-50 to-amber-50 border-orange-200 hover:border-orange-300"
                      )}
                    >
                      <div>
                        <div
                          className={cn(
                            "text-sm font-medium",
                            stat.color === "purple"
                              ? "text-purple-600"
                              : "text-orange-600"
                          )}
                        >
                          {stat.label}
                        </div>
                        <div className="text-2xl font-bold text-gray-900">
                          {stat.value}
                        </div>
                      </div>
                      <stat.icon
                        className={cn(
                          "w-8 h-8",
                          stat.color === "purple"
                            ? "text-purple-500"
                            : "text-orange-500"
                        )}
                      />
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Programas de Milhas - Versão Premium */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="space-y-6"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-gradient-to-br from-[#317873] to-[#a0d6b4] rounded-2xl shadow-lg">
                    <Database className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h2 className="text-3xl font-bold text-gray-900 font-poppins">
                      Programas de Milhas
                    </h2>
                    <p className="text-gray-600 mt-1">
                      Gerencie e sincronize suas milhas automaticamente
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                {programs.map((program, index) => {
                  const config = getProgramConfig(program.program);
                  const programCreds = credentials[program.id] || {
                    username: "",
                    password: "",
                  };
                  const isSyncing = syncingProgram === program.id;
                  const progress = getProgressPercentage(program.id);

                  return (
                    <motion.div
                      key={program.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 + index * 0.1 }}
                      whileHover={{ y: -5 }}
                      className={cn(
                        "bg-white/90 backdrop-blur-xl rounded-3xl border border-white/20 shadow-2xl overflow-hidden transition-all duration-500",
                        config.hoverColor
                      )}
                    >
                      {/* Header do Programa */}
                      <div className="p-6 border-b border-gray-100/50 bg-gradient-to-r from-white to-gray-50/50">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <motion.div
                              whileHover={{ scale: 1.1, rotate: 5 }}
                              className={cn(
                                "w-16 h-16 rounded-2xl flex items-center justify-center border-2 border-white shadow-lg relative overflow-hidden",
                                config.color
                              )}
                            >
                              <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent"></div>
                              <div className="relative w-10 h-10">
                                <Image
                                  src={config.logo}
                                  alt={program.name}
                                  fill
                                  className="object-contain"
                                  onError={(e) => {
                                    const target = e.target as HTMLImageElement;
                                    target.style.display = "none";
                                  }}
                                />
                              </div>
                            </motion.div>
                            <div>
                              <h3 className="font-bold text-gray-900 text-xl font-poppins">
                                {program.name}
                              </h3>
                              <div className="flex items-center gap-2 mt-1">
                                {program.connected ? (
                                  <>
                                    <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                                    <span className="text-sm text-green-600 font-medium">
                                      Conectado
                                    </span>
                                    <span className="text-sm text-gray-500">
                                      • Atualizado{" "}
                                      {formatDate(program.lastUpdate)}
                                    </span>
                                  </>
                                ) : (
                                  <>
                                    <AlertCircle className="w-4 h-4 text-amber-500 flex-shrink-0" />
                                    <span className="text-sm text-amber-600 font-medium">
                                      Não conectado
                                    </span>
                                  </>
                                )}
                              </div>
                            </div>
                          </div>

                          {program.connected && (
                            <motion.div
                              initial={{ opacity: 0, scale: 0.9 }}
                              animate={{ opacity: 1, scale: 1 }}
                              className="text-right"
                            >
                              <div className="text-3xl font-bold bg-gradient-to-br from-[#317873] to-[#a0d6b4] bg-clip-text text-transparent font-poppins">
                                {formatMiles(program.totalMiles)}
                              </div>
                              <div className="text-sm text-gray-600 font-medium">
                                milhas disponíveis
                              </div>
                            </motion.div>
                          )}
                        </div>
                      </div>

                      {/* Conteúdo do Programa */}
                      <div className="p-6">
                        {!program.connected ? (
                          // Formulário de Conexão
                          <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="space-y-6"
                          >
                            <p className="text-gray-600 leading-relaxed">
                              Conecte sua conta{" "}
                              <span className="font-semibold text-gray-900">
                                {program.name}
                              </span>{" "}
                              para acompanhar suas milhas automaticamente e
                              aproveitar todos os benefícios.
                            </p>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <motion.div
                                whileHover={{ scale: 1.02 }}
                                className="space-y-2"
                              >
                                <label className="block text-sm font-semibold text-gray-700">
                                  <User className="w-4 h-4 inline mr-2" />
                                  Usuário
                                </label>
                                <input
                                  type="text"
                                  value={programCreds.username}
                                  onChange={(e) =>
                                    handleCredentialChange(
                                      program.id,
                                      "username",
                                      e.target.value
                                    )
                                  }
                                  className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-[#317873] focus:border-transparent transition-all duration-200 bg-white/50 backdrop-blur-sm hover:border-gray-400"
                                  placeholder="Seu usuário"
                                  disabled={isSyncing}
                                />
                              </motion.div>

                              <motion.div
                                whileHover={{ scale: 1.02 }}
                                className="space-y-2"
                              >
                                <label className="block text-sm font-semibold text-gray-700">
                                  <Key className="w-4 h-4 inline mr-2" />
                                  Senha
                                </label>
                                <div className="relative">
                                  <input
                                    type={
                                      showPassword[program.id]
                                        ? "text"
                                        : "password"
                                    }
                                    value={programCreds.password}
                                    onChange={(e) =>
                                      handleCredentialChange(
                                        program.id,
                                        "password",
                                        e.target.value
                                      )
                                    }
                                    className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-[#317873] focus:border-transparent transition-all duration-200 bg-white/50 backdrop-blur-sm pr-12 hover:border-gray-400"
                                    placeholder="Sua senha"
                                    disabled={isSyncing}
                                  />
                                  <button
                                    type="button"
                                    onClick={() =>
                                      togglePasswordVisibility(program.id)
                                    }
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors disabled:opacity-50"
                                    disabled={isSyncing}
                                  >
                                    {showPassword[program.id] ? (
                                      <EyeOff className="w-5 h-5" />
                                    ) : (
                                      <Eye className="w-5 h-5" />
                                    )}
                                  </button>
                                </div>
                              </motion.div>
                            </div>

                            <motion.div whileHover={{ scale: 1.02 }}>
                              <Button
                                onClick={() => connectProgram(program.id)}
                                loading={isSyncing}
                                variant="primary"
                                icon={<UserCheck className="w-5 h-5" />}
                                className="w-full py-4 text-base font-semibold"
                                disabled={isSyncing}
                              >
                                {isSyncing ? (
                                  <span className="flex items-center gap-2">
                                    <RefreshCw className="w-4 h-4 animate-spin" />
                                    Conectando...
                                  </span>
                                ) : (
                                  "Conectar Conta"
                                )}
                              </Button>
                            </motion.div>
                          </motion.div>
                        ) : (
                          // Programa Conectado
                          <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="space-y-6"
                          >
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                              <div>
                                <div className="text-sm text-gray-600 font-medium">
                                  Saldo atual
                                </div>
                                <div className="text-4xl font-bold bg-gradient-to-br from-[#317873] to-[#a0d6b4] bg-clip-text text-transparent font-poppins">
                                  {formatMiles(program.totalMiles)} milhas
                                </div>
                              </div>

                              <motion.div whileHover={{ scale: 1.05 }}>
                                <Button
                                  onClick={() => syncProgram(program.id)}
                                  loading={isSyncing}
                                  variant="outline"
                                  icon={<RefreshCw className="w-5 h-5" />}
                                  disabled={isSyncing}
                                  className="min-w-[140px]"
                                >
                                  {isSyncing ? (
                                    <span className="flex items-center gap-2">
                                      <RefreshCw className="w-4 h-4 animate-spin" />
                                      {currentStep[program.id]
                                        ? `Etapa ${currentStep[program.id] + 1}`
                                        : "Processando"}
                                    </span>
                                  ) : (
                                    "Atualizar"
                                  )}
                                </Button>
                              </motion.div>
                            </div>

                            {/* Status de Sincronização Premium */}
                            {isSyncing && (
                              <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: "auto" }}
                                className="space-y-4 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl border border-blue-200"
                              >
                                <div className="flex items-center gap-3">
                                  <div className="p-2 bg-blue-100 rounded-lg">
                                    <Cpu className="w-5 h-5 text-blue-600 animate-spin" />
                                  </div>
                                  <div className="flex-1">
                                    <div className="text-sm font-semibold text-blue-800">
                                      {program.id === "1"
                                        ? "Sincronizando LATAM Pass"
                                        : "Sincronizando Programa"}
                                    </div>
                                    <div className="text-xs text-blue-600 mt-1">
                                      {syncStatus.programId === program.id
                                        ? syncStatus.message
                                        : "Iniciando processo..."}
                                    </div>
                                  </div>
                                </div>

                                {/* Barra de progresso animada */}
                                <div className="space-y-2">
                                  <div className="w-full bg-blue-100 rounded-full h-2 overflow-hidden">
                                    <motion.div
                                      className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full shadow-lg shadow-blue-500/25"
                                      initial={{ width: "0%" }}
                                      animate={{ width: `${progress}%` }}
                                      transition={{
                                        duration: 0.5,
                                        ease: "easeOut",
                                      }}
                                    />
                                  </div>
                                  <div className="flex justify-between text-xs text-blue-600">
                                    <span>Progresso</span>
                                    <span className="font-semibold">
                                      {Math.round(progress)}%
                                    </span>
                                  </div>
                                </div>

                                <div className="text-xs text-blue-500 text-center font-medium">
                                  ⏳ Processamento seguro em andamento...
                                </div>
                              </motion.div>
                            )}

                            {/* Histórico de Transações */}
                            {program.transactions.length > 0 && (
                              <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.2 }}
                                className="mt-6"
                              >
                                <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2 text-lg">
                                  <DollarSign className="w-5 h-5 text-[#317873]" />
                                  Histórico Recente
                                </h4>
                                <div className="space-y-3">
                                  {program.transactions.map(
                                    (transaction, tIndex) => (
                                      <motion.div
                                        key={transaction.id}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: tIndex * 0.1 }}
                                        whileHover={{ scale: 1.02, x: 5 }}
                                        className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-white rounded-2xl border border-gray-100 hover:border-gray-200 transition-all duration-200 cursor-pointer"
                                      >
                                        <div className="flex-1 min-w-0">
                                          <div className="font-semibold text-gray-900 truncate">
                                            {transaction.description}
                                          </div>
                                          <div className="text-sm text-gray-600 mt-1 flex items-center gap-2 flex-wrap">
                                            {transaction.partner && (
                                              <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-xs font-medium">
                                                {transaction.partner}
                                              </span>
                                            )}
                                            {transaction.buyer && (
                                              <span className="text-xs">
                                                Comprador: {transaction.buyer}
                                              </span>
                                            )}
                                            <span className="text-xs">
                                              {new Date(
                                                transaction.date
                                              ).toLocaleDateString("pt-BR")}
                                            </span>
                                          </div>
                                        </div>
                                        <div
                                          className={cn(
                                            "text-lg font-bold px-3 py-1 rounded-full transition-all duration-300",
                                            transaction.miles > 0
                                              ? "bg-green-100 text-green-700 hover:bg-green-200"
                                              : "bg-red-100 text-red-700 hover:bg-red-200"
                                          )}
                                        >
                                          {transaction.miles > 0 ? "+" : ""}
                                          {formatMiles(transaction.miles)}
                                        </div>
                                      </motion.div>
                                    )
                                  )}
                                </div>
                              </motion.div>
                            )}
                          </motion.div>
                        )}
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>

            {/* Depoimentos */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              whileHover={{ y: -5 }}
              className="bg-white/90 backdrop-blur-xl rounded-3xl border border-white/20 shadow-2xl shadow-amber-500/10 hover:shadow-3xl hover:shadow-amber-500/20 transition-all duration-500 p-8"
            >
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-amber-100 rounded-2xl">
                    <Heart className="w-6 h-6 text-amber-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 text-xl">
                      Avaliações e Depoimentos
                    </h3>
                    <p className="text-gray-600">
                      Feedback de clientes satisfeitos
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold text-gray-900">
                    {user.rating.toFixed(1)}
                  </div>
                  <div className="text-sm text-gray-600">Avaliação média</div>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {user.testimonials.map((testimonial, index) => (
                  <motion.div
                    key={testimonial.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 * index }}
                    whileHover={{
                      scale: 1.02,
                      y: -5,
                      transition: { duration: 0.2 },
                    }}
                    className="bg-gradient-to-br from-white to-gray-50 rounded-2xl border border-gray-200 p-6 shadow-lg hover:shadow-xl transition-all duration-300 group cursor-pointer"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <div className="font-semibold text-gray-900 group-hover:text-[#317873] transition-colors duration-300">
                          {testimonial.author}
                        </div>
                        <div className="flex items-center gap-1 mt-1">
                          <StarRating rating={testimonial.rating} size="sm" />
                          {testimonial.verified && (
                            <BadgeCheck className="w-4 h-4 text-blue-500 ml-1" />
                          )}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm text-gray-500">
                          {new Date(testimonial.date).toLocaleDateString(
                            "pt-BR"
                          )}
                        </div>
                        <div className="text-xs text-gray-400">
                          {testimonial.transactionValue.toLocaleString("pt-BR")}{" "}
                          milhas
                        </div>
                      </div>
                    </div>
                    <p className="text-gray-700 leading-relaxed text-sm group-hover:text-gray-900 transition-colors duration-300">
                      &quot;{testimonial.comment}&quot;
                    </p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
