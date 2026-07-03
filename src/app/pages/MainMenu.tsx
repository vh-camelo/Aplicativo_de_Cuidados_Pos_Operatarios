import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import {
  Heart,
  Activity,
  AlertTriangle,
  CheckSquare,
  Phone,
  FileText,
  LogOut,
  User,
  Pencil,
  Pill,
  FileDown,
} from "lucide-react";
import { Card, CardContent } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import jsPDF from "jspdf";

interface PatientInfo {
  nome: string;
  dataCirurgia: string;
  tipoCirurgia: string;
  proximaConsulta: string;
  prontuario: string;
}

interface PainRecord {
  id: number;
  level: number;
  time: string;
  date: string;
}

interface Medication {
  id: string;
  nome: string;
  dose: string;
  horarios: string[];
  horarioInicial?: string;
  frequenciaHoras?: number;
}

interface AlertRecord {
  id: string;
  sinais: string[];
  observacao: string;
  data: string;
  hora: string;
}

function calcularDiasRecuperacao(dataCirurgia: string): number {
  if (!dataCirurgia) return 0;
  const cirurgia = new Date(dataCirurgia);
  const hoje = new Date();
  const diff = hoje.getTime() - cirurgia.getTime();
  return Math.floor(diff / (1000 * 60 * 60 * 24));
}

function formatarData(data: string): string {
  if (!data) return "Não informada";
  const [ano, mes, dia] = data.split("-");
  return `${dia}/${mes}/${ano}`;
}

export function MainMenu() {
  const navigate = useNavigate();
  const profileId = localStorage.getItem("active_profile") || "";

  const [patientInfo, setPatientInfo] = useState<PatientInfo>(() => {
    const saved = localStorage.getItem(`${profileId}_patient_info`);
    return saved ? JSON.parse(saved) : {
      nome: "Paciente",
      dataCirurgia: "",
      tipoCirurgia: "",
      proximaConsulta: "",
      prontuario: "Não informado",
    };
  });

  const [showEditModal, setShowEditModal] = useState(false);
  const [showFinishModal, setShowFinishModal] = useState(false);

  const [editForm, setEditForm] = useState<PatientInfo>({
    nome: patientInfo.nome || "",
    dataCirurgia: patientInfo.dataCirurgia || "",
    tipoCirurgia: patientInfo.tipoCirurgia || "",
    proximaConsulta: patientInfo.proximaConsulta || "",
    prontuario: patientInfo.prontuario || "",
  });

  useEffect(() => {
    localStorage.setItem(`${profileId}_patient_info`, JSON.stringify(patientInfo));
  }, [patientInfo]);

  const handleOpenEdit = () => {
    setEditForm({
      nome: patientInfo.nome || "",
      dataCirurgia: patientInfo.dataCirurgia || "",
      tipoCirurgia: patientInfo.tipoCirurgia || "",
      proximaConsulta: patientInfo.proximaConsulta || "",
      prontuario: patientInfo.prontuario || "",
    });
    setShowEditModal(true);
  };

  const handleSaveEdit = () => {
    setPatientInfo(editForm);
    const savedProfiles = localStorage.getItem("profiles");
    if (savedProfiles) {
      const profiles = JSON.parse(savedProfiles);
      const updated = profiles.map((p: { id: string; nome: string }) =>
        p.id === profileId ? { ...p, nome: editForm.nome } : p
      );
      localStorage.setItem("profiles", JSON.stringify(updated));
    }
    setShowEditModal(false);
  };

  const handleFinishTreatment = () => {
    localStorage.removeItem(`${profileId}_patient_info`);
    localStorage.removeItem(`${profileId}_pain_records`);
    localStorage.removeItem(`${profileId}_checklist_items`);
    localStorage.removeItem(`${profileId}_checklist_day`);
    localStorage.removeItem(`${profileId}_emergency_contacts`);
    localStorage.removeItem(`${profileId}_medications`);
    localStorage.removeItem(`${profileId}_alert_records`);

    const savedProfiles = localStorage.getItem("profiles");
    if (savedProfiles) {
      const profiles = JSON.parse(savedProfiles);
      const updated = profiles.filter((p: { id: string }) => p.id !== profileId);
      localStorage.setItem("profiles", JSON.stringify(updated));
    }

    localStorage.removeItem("active_profile");
    navigate("/");
  };

  const handleGenerateReport = () => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    let y = 20;

    const addLine = (text: string, fontSize = 11, isBold = false) => {
      if (y > 270) {
        doc.addPage();
        y = 20;
      }
      doc.setFontSize(fontSize);
      doc.setFont("helvetica", isBold ? "bold" : "normal");
      const lines = doc.splitTextToSize(text, pageWidth - 30);
      doc.text(lines, 15, y);
      y += 7 * lines.length;
    };

    const addSeparator = () => {
      if (y > 270) { doc.addPage(); y = 20; }
      doc.setDrawColor(200, 200, 200);
      doc.line(15, y, pageWidth - 15, y);
      y += 6;
    };

    const addSection = (title: string) => {
      y += 4;
      doc.setFillColor(59, 130, 246);
      doc.rect(15, y - 5, pageWidth - 30, 10, "F");
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(12);
      doc.setFont("helvetica", "bold");
      doc.text(title, 18, y + 2);
      doc.setTextColor(0, 0, 0);
      y += 12;
    };

    // ── Cabeçalho ──────────────────────────────────────────────────
    doc.setFillColor(37, 99, 235);
    doc.rect(0, 0, pageWidth, 35, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    doc.text("Relatório de Recuperação Pós-Operatória", pageWidth / 2, 15, { align: "center" });
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text(`Gerado em: ${new Date().toLocaleDateString("pt-BR")} às ${new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}`, pageWidth / 2, 25, { align: "center" });
    doc.setTextColor(0, 0, 0);
    y = 45;

    // ── Dados do paciente ──────────────────────────────────────────
    addSection("Dados do Paciente");
    addLine(`Nome: ${patientInfo.nome}`, 11, true);
    addLine(`Tipo de Cirurgia: ${patientInfo.tipoCirurgia || "Não informado"}`);
    addLine(`Data da Cirurgia: ${formatarData(patientInfo.dataCirurgia)}`);
    addLine(`Dias de Recuperação: ${calcularDiasRecuperacao(patientInfo.dataCirurgia)} dias`);
    addLine(`Próxima Consulta: ${patientInfo.proximaConsulta ? formatarData(patientInfo.proximaConsulta) : "Não informada"}`);

    // ── Medicamentos ───────────────────────────────────────────────
    addSection("Medicamentos em Uso");
    const medications: Medication[] = JSON.parse(localStorage.getItem(`${profileId}_medications`) || "[]");
    if (medications.length === 0) {
      addLine("Nenhum medicamento cadastrado.");
    } else {
      medications.forEach((med, i) => {
        addLine(`${i + 1}. ${med.nome}${med.dose ? ` — ${med.dose}` : ""}`, 11, true);
        if (med.frequenciaHoras && med.horarioInicial) {
          addLine(`   Frequência: a cada ${med.frequenciaHoras}h, iniciando às ${med.horarioInicial}`);
        } else if (med.horarios.length > 0) {
          addLine(`   Horários: ${med.horarios.join(", ")}`);
        }
        y += 2;
      });
    }

    // ── Histórico de dor ───────────────────────────────────────────
    addSection("Histórico de Nível de Dor");
    const painRecords: PainRecord[] = JSON.parse(localStorage.getItem(`${profileId}_pain_records`) || "[]");
    if (painRecords.length === 0) {
      addLine("Nenhum registro de dor encontrado.");
    } else {
      const media = Math.round(painRecords.reduce((s, r) => s + r.level, 0) / painRecords.length);
      const maior = Math.max(...painRecords.map(r => r.level));
      const menor = Math.min(...painRecords.map(r => r.level));
      addLine(`Registros: ${painRecords.length}  |  Média: ${media}  |  Maior: ${maior}  |  Menor: ${menor}`);
      addSeparator();
      painRecords.forEach(record => {
        const descricao = record.level <= 3 ? "Leve" : record.level <= 6 ? "Moderada" : "Forte";
        addLine(`• ${record.date} às ${record.time} — Nível ${record.level}/10 (${descricao})`);
      });
    }

    // ── Sinais de alerta ───────────────────────────────────────────
    addSection("Histórico de Sinais de Alerta");
    const alertRecords: AlertRecord[] = JSON.parse(localStorage.getItem(`${profileId}_alert_records`) || "[]");
    if (alertRecords.length === 0) {
      addLine("Nenhum sinal de alerta registrado.");
    } else {
      alertRecords.forEach(record => {
        addLine(`• ${record.data} às ${record.hora}`, 11, true);
        addLine(`  Sinais: ${record.sinais.join(", ")}`);
        if (record.observacao) {
          addLine(`  Observação: ${record.observacao}`);
        }
        y += 2;
      });
    }

    // ── Rodapé ─────────────────────────────────────────────────────
    const totalPages = doc.getNumberOfPages();
    for (let i = 1; i <= totalPages; i++) {
      doc.setPage(i);
      doc.setFontSize(9);
      doc.setTextColor(150, 150, 150);
      doc.text(
        `Página ${i} de ${totalPages} — Relatório gerado pelo app Cuidados Pós-Operatórios`,
        pageWidth / 2,
        290,
        { align: "center" }
      );
    }

    // Baixa o arquivo
    const nomeArquivo = `relatorio_${patientInfo.nome.replace(/\s+/g, "_")}_${new Date().toLocaleDateString("pt-BR").replace(/\//g, "-")}.pdf`;
    doc.save(nomeArquivo);
  };

  const diasRecuperacao = calcularDiasRecuperacao(patientInfo.dataCirurgia);

  const menuItems = [
    {
      title: "Cuidados Pós-Operatórios",
      description: "Instruções e recomendações",
      icon: FileText,
      path: "/cuidados",
      color: "bg-blue-500",
    },
    {
      title: "Meus Medicamentos",
      description: "Gerencie seus medicamentos",
      icon: Pill,
      path: "/medicamentos",
      color: "bg-teal-500",
    },
    {
      title: "Controle da Dor",
      description: "Registre e monitore sua dor",
      icon: Activity,
      path: "/dor",
      color: "bg-purple-500",
    },
    {
      title: "Sinais de Alerta",
      description: "Saiba quando procurar ajuda",
      icon: AlertTriangle,
      path: "/alertas",
      color: "bg-red-500",
    },
    {
      title: "Checklist Diário",
      description: "Acompanhe sua recuperação",
      icon: CheckSquare,
      path: "/checklist",
      color: "bg-green-500",
    },
    {
      title: "Contato de Emergência",
      description: "Números importantes",
      icon: Phone,
      path: "/emergencia",
      color: "bg-orange-500",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">

      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
              <Heart className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="font-semibold">Cuidados Pós-Operatórios</h1>
              <p className="text-sm text-gray-500">Bem-vindo de volta</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/")}
            className="text-gray-500"
          >
            <LogOut className="w-5 h-5" />
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-8">

        {/* Patient Info Card */}
        <Card className="mb-6 bg-gradient-to-r from-blue-600 to-indigo-600 text-white border-0">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                  <User className="w-8 h-8" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold">{patientInfo.nome}</h2>
                  <p className="text-blue-100">
                    Cirurgia realizada em: {formatarData(patientInfo.dataCirurgia)}
                  </p>
                  <p className="text-blue-100">
                    {diasRecuperacao > 0
                      ? `Dia ${diasRecuperacao} de recuperação`
                      : "Data da cirurgia não informada"}
                  </p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleOpenEdit}
                className="text-white hover:bg-white/20"
              >
                <Pencil className="w-5 h-5" />
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Menu Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <Card
                key={item.path}
                className="cursor-pointer hover:shadow-lg transition-shadow"
                onClick={() => navigate(item.path)}
              >
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className={`${item.color} w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">{item.title}</h3>
                      <p className="text-sm text-gray-500">{item.description}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Botão Enviar Relatório */}
        <Card
          className="mt-6 cursor-pointer border-2 border-blue-200 hover:border-blue-400 hover:bg-blue-50 transition-colors"
          onClick={handleGenerateReport}
        >
          <CardContent className="py-4">
            <div className="flex items-center justify-center gap-2">
              <FileDown className="w-5 h-5 text-blue-500" />
              <p className="text-center text-blue-600 font-medium">
                Enviar Relatório
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Botão finalizar tratamento */}
        <Card
          className="mt-4 cursor-pointer border-2 border-dashed border-gray-300 hover:border-red-400 hover:bg-red-50 transition-colors"
          onClick={() => setShowFinishModal(true)}
        >
          <CardContent className="py-4">
            <p className="text-center text-gray-500 hover:text-red-500 font-medium transition-colors">
              Tratamento Finalizado?
            </p>
          </CardContent>
        </Card>

      </div>

      {/* Modal de editar informações */}
      {showEditModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="fixed inset-0 bg-black/50" onClick={() => setShowEditModal(false)} />
          <div className="relative bg-white rounded-lg shadow-lg w-full max-w-md mx-4 p-6 space-y-4">
            <h2 className="text-lg font-semibold">Editar Informações</h2>
            <p className="text-sm text-gray-500">Atualize suas informações de recuperação.</p>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Nome</Label>
                <Input
                  value={editForm.nome}
                  onChange={(e) => setEditForm({ ...editForm, nome: e.target.value })}
                  placeholder="Seu nome completo"
                />
              </div>
              <div className="space-y-2">
                <Label>Data da Cirurgia</Label>
                <Input
                  type="date"
                  value={editForm.dataCirurgia}
                  onChange={(e) => setEditForm({ ...editForm, dataCirurgia: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Tipo de Cirurgia</Label>
                <Input
                  value={editForm.tipoCirurgia}
                  onChange={(e) => setEditForm({ ...editForm, tipoCirurgia: e.target.value })}
                  placeholder="Ex: Apendicectomia, Cesárea..."
                />
              </div>
            </div>
            <div className="flex gap-2 justify-end pt-2">
              <Button variant="outline" onClick={() => setShowEditModal(false)}>
                Cancelar
              </Button>
              <Button className="bg-blue-600 hover:bg-blue-700" onClick={handleSaveEdit}>
                Salvar
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de finalizar tratamento */}
      {showFinishModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="fixed inset-0 bg-black/50" onClick={() => setShowFinishModal(false)} />
          <div className="relative bg-white rounded-lg shadow-lg w-full max-w-md mx-4 p-6 space-y-4">
            <h2 className="text-lg font-semibold">Finalizar Tratamento</h2>
            <p className="text-sm text-gray-500">Seu tratamento já encerrou?</p>
            <p className="text-sm text-gray-500">
              Ao confirmar, todos os seus dados serão apagados e o app voltará
              ao início. Essa ação não pode ser desfeita.
            </p>
            <div className="flex gap-2 justify-end pt-2">
              <Button variant="outline" onClick={() => setShowFinishModal(false)}>
                Cancelar
              </Button>
              <Button className="bg-red-600 hover:bg-red-700" onClick={handleFinishTreatment}>
                Sim, finalizar
              </Button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}