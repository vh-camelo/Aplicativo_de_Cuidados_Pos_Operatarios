import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { ArrowLeft, CheckCircle2, Circle, Pill, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Checkbox } from "../components/ui/checkbox";
import { Progress } from "../components/ui/progress";

interface SubItem {
  id: string;
  label: string;
  selected: boolean;
}

interface ChecklistItem {
  id: string;
  label: string;
  completed: boolean;
  subItems?: SubItem[];
  isExclusive?: boolean;
}

interface Medication {
  id: string;
  nome: string;
  dose: string;
  horarios: string[];
  horarioInicial?: string;
  frequenciaHoras?: number;
}

interface MedicationCheck {
  id: string;
  label: string;
  completed: boolean;
}

const defaultItems: ChecklistItem[] = [
  {
    id: "1",
    label: "Tomei os medicamentos prescritos",
    completed: false,
  },
  {
    id: "2",
    label: "Registrei meu nível de dor",
    completed: false,
  },
  {
    id: "3",
    label: "Caminhei ou me movimentei conforme orientação",
    completed: false,
  },
  {
    id: "4",
    label: "Observei minha ferida cirúrgica",
    completed: false,
    subItems: [
      { id: "4-1", label: "Tem Vermelhidão",        selected: false },
      { id: "4-2", label: "Tem Secreção",            selected: false },
      { id: "4-3", label: "Tem Abertura dos pontos", selected: false },
      { id: "4-4", label: "Não tem alterações",      selected: false },
    ],
  },
  {
    id: "5",
    label: "Fiz o curativo",
    completed: false,
  },
  {
    id: "6",
    label: "Evacuei hoje",
    completed: false,
  },
  {
    id: "7",
    label: "Estou eliminando gases normalmente",
    completed: false,
  },
  {
    id: "8",
    label: "Como você se sentiu hoje?",
    completed: false,
    isExclusive: true,
    subItems: [
      { id: "8-1", label: "Muito bem", selected: false },
      { id: "8-2", label: "Bem",       selected: false },
      { id: "8-3", label: "Regular",   selected: false },
      { id: "8-4", label: "Mal",       selected: false },
    ],
  },
];

function getDayKey(): string {
  const now = new Date();
  if (now.getHours() < 2) {
    now.setHours(now.getHours() - 2);
  }
  return now.toISOString().split("T")[0];
}


function generateMedItems(medications: Medication[]): MedicationCheck[] {
  const items: MedicationCheck[] = [];
  medications.forEach((med) => {

    const horarios = med.horarios.length > 0 ? med.horarios : [];
    horarios.forEach((horario) => {
      items.push({
        id: `med_${med.id}_${horario}`,
        label: `${med.nome}${med.dose ? ` — ${med.dose}` : ""} • ${horario}`,
        completed: false,
      });
    });
  });
  return items;
}

export function Checklist() {
  const navigate = useNavigate();
  const profileId = localStorage.getItem("active_profile") || "";


  const getMedications = (): Medication[] => {
    const saved = localStorage.getItem(`${profileId}_medications`);
    return saved ? JSON.parse(saved) : [];
  };

  const todayKey = getDayKey();
  const savedDay = localStorage.getItem(`${profileId}_checklist_day`);
  const isNewDay = savedDay !== todayKey;

  const [items, setItems] = useState<ChecklistItem[]>(() => {
    const savedItems = localStorage.getItem(`${profileId}_checklist_items`);
    if (!isNewDay && savedItems) {
      return JSON.parse(savedItems);
    }
    return defaultItems;
  });


  const [medItems, setMedItems] = useState<MedicationCheck[]>(() => {
    const savedMedItems = localStorage.getItem(`${profileId}_checklist_med_items`);
    if (!isNewDay && savedMedItems) {
      return JSON.parse(savedMedItems);
    }
    return generateMedItems(getMedications());
  });

  useEffect(() => {
    localStorage.setItem(`${profileId}_checklist_items`, JSON.stringify(items));
    localStorage.setItem(`${profileId}_checklist_med_items`, JSON.stringify(medItems));
    localStorage.setItem(`${profileId}_checklist_day`, todayKey);
  }, [items, medItems]);

  const toggleItem = (id: string) => {
    setItems(items.map(item =>
      item.id === id ? { ...item, completed: !item.completed } : item
    ));
  };

  const toggleSubItem = (itemId: string, subId: string) => {
    setItems(items.map(item => {
      if (item.id !== itemId || !item.subItems) return item;
      const updatedSubs = item.subItems.map(sub => {
        if (item.isExclusive) {
          return { ...sub, selected: sub.id === subId ? !sub.selected : false };
        }
        return sub.id === subId ? { ...sub, selected: !sub.selected } : sub;
      });
      return { ...item, subItems: updatedSubs };
    }));
  };

  const toggleMedItem = (id: string) => {
    setMedItems(medItems.map(item =>
      item.id === id ? { ...item, completed: !item.completed } : item
    ));
  };

  const completedCount = items.filter(i => i.completed).length +
    medItems.filter(i => i.completed).length;
  const totalCount = items.length + medItems.length;
  const progress = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <div className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => navigate("/menu")}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="font-semibold text-lg">Checklist Diário</h1>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6 space-y-4">

        {/* Progresso do dia */}
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold">Progresso do Dia</h3>
                <span className="text-sm text-gray-500">
                  {completedCount} de {totalCount} concluídos
                </span>
              </div>
              <Progress value={progress} className="h-2" />
              {progress === 100 && (
                <div className="flex items-center gap-2 text-green-600 text-sm">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Parabéns! Você completou todas as tarefas de hoje!</span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Card de medicamentos */}
        {medItems.length > 0 && (
          <Card className="border-teal-200">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Pill className="w-5 h-5 text-teal-600" />
                  <span>Medicamentos</span>
                </div>
                <span className="text-sm font-normal text-gray-500">
                  {medItems.filter(i => i.completed).length}/{medItems.length}
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {medItems.map((item) => (
                  <div key={item.id} className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                    <Checkbox
                      id={item.id}
                      checked={item.completed}
                      onCheckedChange={() => toggleMedItem(item.id)}
                    />
                    <label htmlFor={item.id} className={`flex-1 cursor-pointer text-sm ${item.completed ? "line-through text-gray-400" : ""}`}>
                      {item.label}
                    </label>
                    {item.completed
                      ? <CheckCircle2 className="w-5 h-5 text-green-500" />
                      : <Circle className="w-5 h-5 text-gray-300" />
                    }
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Checklist do dia */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Tarefas do Dia</span>
              <span className="text-sm font-normal text-gray-500">
                {items.filter(i => i.completed).length}/{items.length}
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {items.map((item) => (
                <div key={item.id}>
                  <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                    <Checkbox
                      id={item.id}
                      checked={item.completed}
                      onCheckedChange={() => toggleItem(item.id)}
                    />
                    <label htmlFor={item.id} className={`flex-1 cursor-pointer ${item.completed ? "line-through text-gray-400" : ""}`}>
                      {item.label}
                    </label>
                    {item.subItems && item.completed && <ChevronUp className="w-4 h-4 text-gray-400" />}
                    {item.subItems && !item.completed && <ChevronDown className="w-4 h-4 text-gray-400" />}
                    {!item.subItems && (
                      item.completed
                        ? <CheckCircle2 className="w-5 h-5 text-green-500" />
                        : <Circle className="w-5 h-5 text-gray-300" />
                    )}
                  </div>

                  {item.subItems && item.completed && (
                    <div className="ml-8 mt-1 mb-2 space-y-1 border-l-2 border-blue-100 pl-3">
                      {item.subItems.map((sub) => (
                        <div
                          key={sub.id}
                          className="flex items-center gap-3 p-2 rounded-lg hover:bg-blue-50 transition-colors cursor-pointer"
                          onClick={() => toggleSubItem(item.id, sub.id)}
                        >
                          <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-colors ${
                            sub.selected ? "bg-blue-500 border-blue-500" : "border-gray-300"
                          }`}>
                            {sub.selected && <div className="w-2 h-2 rounded-full bg-white" />}
                          </div>
                          <span className={`text-sm ${sub.selected ? "text-blue-700 font-medium" : "text-gray-600"}`}>
                            {sub.label}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Dicas */}
        <Card className="bg-green-50 border-green-200">
          <CardContent className="pt-6">
            <h3 className="font-semibold mb-2 text-green-900">Dicas</h3>
            <ul className="space-y-1 text-sm text-green-800">
              <li>• Marque as tarefas conforme as realiza durante o dia</li>
              <li>• Use o checklist como um guia para sua rotina de recuperação</li>
              <li>• O checklist é reiniciado diariamente às 02h da manhã</li>
              <li>• Medicamentos adicionados aparecem automaticamente no dia seguinte</li>
            </ul>
          </CardContent>
        </Card>

      </div>
    </div>
  );
}