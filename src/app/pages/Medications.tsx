import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { ArrowLeft, Pill, Plus, Trash2, Pencil, Clock } from "lucide-react";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Checkbox } from "../components/ui/checkbox";

interface Medication {
  id: string;
  nome: string;
  dose: string;
  horarios: string[];
  horarioInicial: string;
  frequenciaHoras: number;
}

const frequencias = [
  { label: "A cada 4 horas",  value: 4  },
  { label: "A cada 6 horas",  value: 6  },
  { label: "A cada 8 horas",  value: 8  },
  { label: "A cada 12 horas", value: 12 },
  { label: "A cada 24 horas", value: 24 },
];

function calcularProximosHorarios(horarioInicial: string, frequenciaHoras: number): string[] {
  if (!horarioInicial || !frequenciaHoras) return [];

  const [hora, minuto] = horarioInicial.split(":").map(Number);
  const horarios: string[] = [];
  let totalMinutos = hora * 60 + minuto;

  const quantidadeDoses = Math.floor(24 / frequenciaHoras);

  for (let i = 0; i < quantidadeDoses; i++) {
    const h = Math.floor(totalMinutos / 60) % 24;
    const m = totalMinutos % 60;
    horarios.push(`${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`);
    totalMinutos += frequenciaHoras * 60;
  }

  return horarios;
}

export function Medications() {
  const navigate = useNavigate();
  const profileId = localStorage.getItem("active_profile") || "";

  const [medications, setMedications] = useState<Medication[]>(() => {
    const saved = localStorage.getItem(`${profileId}_medications`);
    return saved ? JSON.parse(saved) : [];
  });

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState<string | null>(null);

  const [medNome, setMedNome] = useState("");
  const [medDose, setMedDose] = useState("");
  const [medHorarios, setMedHorarios] = useState<string[]>([]);
  const [medHorarioInicial, setMedHorarioInicial] = useState("");
  const [medFrequencia, setMedFrequencia] = useState<number>(0);

  useEffect(() => {
    localStorage.setItem(`${profileId}_medications`, JSON.stringify(medications));
  }, [medications]);

  const toggleHorario = (horario: string) => {
    if (medHorarios.includes(horario)) {
      setMedHorarios(medHorarios.filter(h => h !== horario));
    } else {
      setMedHorarios([...medHorarios, horario]);
    }
  };

  const resetForm = () => {
    setMedNome("");
    setMedDose("");
    setMedHorarios([]);
    setMedHorarioInicial("");
    setMedFrequencia(0);
    setEditingId(null);
    setShowForm(false);
  };

  const handleOpenAdd = () => {
    resetForm();
    setShowForm(true);
  };

  const handleOpenEdit = (med: Medication) => {
    setMedNome(med.nome);
    setMedDose(med.dose);
    setMedHorarios(med.horarios);
    setMedHorarioInicial(med.horarioInicial || "");
    setMedFrequencia(med.frequenciaHoras || 0);
    setEditingId(med.id);
    setShowForm(true);
  };

  const handleSave = () => {
    if (!medNome) return;

    const horariosFinais = medFrequencia && medHorarioInicial
      ? calcularProximosHorarios(medHorarioInicial, medFrequencia)
      : medHorarios;

    const horariosCategorias = horariosFinais.length > 0
      ? horariosFinais.map(h => {
          const hora = parseInt(h.split(":")[0]);
          if (hora >= 5 && hora < 12) return "Manhã";
          if (hora >= 12 && hora < 18) return "Tarde";
          return "Noite";
        }).filter((v, i, a) => a.indexOf(v) === i) // remove duplicatas
      : medHorarios;

    const newMed: Medication = {
      id: editingId || Date.now().toString(),
      nome: medNome,
      dose: medDose,
      horarios: horariosCategorias,
      horarioInicial: medHorarioInicial,
      frequenciaHoras: medFrequencia,
    };

    if (editingId) {
      setMedications(medications.map(m => m.id === editingId ? newMed : m));
    } else {
      setMedications([...medications, newMed]);
    }

    resetForm();
  };

  const handleDelete = (id: string) => {
    setMedications(medications.filter(m => m.id !== id));
    setShowDeleteModal(null);
  };

  const proximosHorarios = medFrequencia && medHorarioInicial
    ? calcularProximosHorarios(medHorarioInicial, medFrequencia)
    : [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <div className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={() => navigate("/menu")}>
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <h1 className="font-semibold text-lg">Meus Medicamentos</h1>
          </div>
          <Button
            className="bg-teal-500 hover:bg-teal-600"
            onClick={handleOpenAdd}
          >
            <Plus className="w-4 h-4 mr-2" />
            Adicionar
          </Button>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6 space-y-4">

        {/* Lista vazia */}
        {medications.length === 0 && !showForm && (
          <Card>
            <CardContent className="py-12 text-center">
              <Pill className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500 font-medium">Nenhum medicamento cadastrado</p>
              <p className="text-sm text-gray-400 mt-1">
                Toque em "Adicionar" para cadastrar seu primeiro medicamento
              </p>
            </CardContent>
          </Card>
        )}

        {/* Formulário de adicionar/editar */}
        {showForm && (
          <Card className="border-teal-200">
            <CardHeader>
              <CardTitle className="text-teal-700">
                {editingId ? "Editar Medicamento" : "Novo Medicamento"}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">

              <div className="space-y-2">
                <Label>Nome do Medicamento *</Label>
                <Input
                  placeholder="Ex: Dipirona 500mg"
                  value={medNome}
                  onChange={(e) => setMedNome(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label>Dose</Label>
                <Input
                  placeholder="Ex: 1 comprimido"
                  value={medDose}
                  onChange={(e) => setMedDose(e.target.value)}
                />
              </div>

              {/* Horário e frequência */}
              <div className="bg-teal-50 rounded-lg p-4 space-y-3">
                <h3 className="font-medium text-teal-800 flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  Horário e Frequência
                </h3>

                <div className="space-y-2">
                  <Label>Horário da primeira dose</Label>
                  <Input
                    type="time"
                    value={medHorarioInicial}
                    onChange={(e) => setMedHorarioInicial(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Frequência</Label>
                  <div className="grid grid-cols-2 gap-2">
                    {frequencias.map((f) => (
                      <button
                        key={f.value}
                        onClick={() => setMedFrequencia(f.value)}
                        className={`p-2 rounded-lg text-sm border-2 transition-colors ${
                          medFrequencia === f.value
                            ? "border-teal-500 bg-teal-100 text-teal-800 font-medium"
                            : "border-gray-200 bg-white text-gray-600 hover:border-teal-300"
                        }`}
                      >
                        {f.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Preview dos horários calculados */}
                {proximosHorarios.length > 0 && (
                  <div className="bg-white rounded-lg p-3 border border-teal-200">
                    <p className="text-xs font-medium text-teal-700 mb-2">
                      Horários calculados:
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {proximosHorarios.map((h) => (
                        <span
                          key={h}
                          className="text-xs bg-teal-100 text-teal-800 px-2 py-1 rounded-full font-medium"
                        >
                          {h}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Turnos manuais — aparece só se não tiver frequência definida */}
              {!medFrequencia && (
                <div className="space-y-2">
                  <Label>Ou selecione os turnos manualmente</Label>
                  <div className="flex gap-4">
                    {["Manhã", "Tarde", "Noite"].map((horario) => (
                      <div key={horario} className="flex items-center gap-2">
                        <Checkbox
                          id={`horario-${horario}`}
                          checked={medHorarios.includes(horario)}
                          onCheckedChange={() => toggleHorario(horario)}
                        />
                        <label htmlFor={`horario-${horario}`} className="text-sm cursor-pointer">
                          {horario}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex gap-2 pt-2">
                <Button
                  className="flex-1 bg-teal-500 hover:bg-teal-600"
                  onClick={handleSave}
                  disabled={!medNome}
                >
                  {editingId ? "Salvar alterações" : "Adicionar"}
                </Button>
                <Button variant="outline" className="flex-1" onClick={resetForm}>
                  Cancelar
                </Button>
              </div>

            </CardContent>
          </Card>
        )}

        {/* Lista de medicamentos */}
        {medications.map((med) => {
          const horarios = med.frequenciaHoras && med.horarioInicial
            ? calcularProximosHorarios(med.horarioInicial, med.frequenciaHoras)
            : [];

          return (
            <Card key={med.id} className="overflow-hidden">
              <CardContent className="p-0">
                <div className="flex">
                  <div className="bg-teal-500 w-2 flex-shrink-0" />
                  <div className="flex-1 p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-teal-100 rounded-lg flex items-center justify-center flex-shrink-0">
                          <Pill className="w-5 h-5 text-teal-600" />
                        </div>
                        <div>
                          <h3 className="font-semibold">{med.nome}</h3>
                          {med.dose && (
                            <p className="text-sm text-gray-500">{med.dose}</p>
                          )}
                        </div>
                      </div>

                      {/* Botões editar e excluir */}
                      <div className="flex gap-1">
                        <button
                          onClick={() => handleOpenEdit(med)}
                          className="p-2 text-gray-400 hover:text-teal-600 transition-colors rounded-lg hover:bg-teal-50"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setShowDeleteModal(med.id)}
                          className="p-2 text-gray-400 hover:text-red-500 transition-colors rounded-lg hover:bg-red-50"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* Horários calculados */}
                    {horarios.length > 0 && (
                      <div className="mt-3">
                        <p className="text-xs text-gray-500 mb-1 flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          A cada {med.frequenciaHoras}h — horários do dia:
                        </p>
                        <div className="flex flex-wrap gap-1">
                          {horarios.map((h) => (
                            <span
                              key={h}
                              className="text-xs bg-teal-100 text-teal-800 px-2 py-0.5 rounded-full"
                            >
                              {h}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Turnos manuais */}
                    {horarios.length === 0 && med.horarios.length > 0 && (
                      <div className="mt-3 flex flex-wrap gap-1">
                        {med.horarios.map((h) => (
                          <span
                            key={h}
                            className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full"
                          >
                            {h}
                          </span>
                        ))}
                      </div>
                    )}

                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}

      </div>

      {/* Modal de confirmação de exclusão */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="fixed inset-0 bg-black/50" onClick={() => setShowDeleteModal(null)} />
          <div className="relative bg-white rounded-lg shadow-lg w-full max-w-sm mx-4 p-6 space-y-4">
            <h2 className="text-lg font-semibold">Excluir Medicamento</h2>
            <p className="text-sm text-gray-500">
              Tem certeza que deseja excluir este medicamento? Ele também será
              removido do checklist diário.
            </p>
            <div className="flex gap-2 justify-end">
              <Button variant="outline" onClick={() => setShowDeleteModal(null)}>
                Cancelar
              </Button>
              <Button
                className="bg-red-600 hover:bg-red-700"
                onClick={() => handleDelete(showDeleteModal)}
              >
                Sim, excluir
              </Button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}