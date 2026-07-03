import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { ArrowLeft, AlertTriangle, Phone, ClipboardList } from "lucide-react";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Alert, AlertDescription } from "../components/ui/alert";
import { Checkbox } from "../components/ui/checkbox";

interface AlertRecord {
  id: string;
  sinais: string[];
  observacao: string;
  data: string;
  hora: string;
}

const emergencySigns = [
  { title: "Febre Alta",            description: "Temperatura acima de 38°C persistente",          severity: "high" },
  { title: "Sangramento Excessivo", description: "Sangramento que não para ou piora",               severity: "high" },
  { title: "Dor Intensa",           description: "Dor que não melhora com medicação",               severity: "high" },
  { title: "Secreção Purulenta",    description: "Pus ou secreção com mau cheiro na ferida",        severity: "high" },
  { title: "Inchaço Excessivo",     description: "Inchaço que aumenta rapidamente",                 severity: "high" },
  { title: "Vermelhidão Crescente", description: "Vermelhidão que se espalha pela pele",            severity: "high" },
  { title: "Falta de Ar",           description: "Dificuldade para respirar ou respiração rápida",  severity: "high" },
  { title: "Náusea e Vômito",       description: "Náusea e vômito persistentes",                    severity: "high" },
  { title: "Abertura da Ferida",    description: "Pontos ou ferida que se abre",                    severity: "high" },
  { title: "Dor no Peito",          description: "Dor no peito ou palpitações",                     severity: "high" },
  { title: "Confusão Mental",       description: "Desorientação ou confusão",                       severity: "high" },
  { title: "Reação Alérgica",       description: "Coceira intensa, urticária ou inchaço",           severity: "high" },
];

const getSeverityColor = (severity: string) => {
  if (severity === "high") return "border-red-300 bg-red-50";
  return "border-yellow-300 bg-yellow-50";
};

const getSeverityDot = (severity: string) => {
  if (severity === "high") return "bg-red-500";
  return "bg-yellow-500";
};


function getDayKey(): string {
  const now = new Date();
  if (now.getHours() < 2) {
    now.setHours(now.getHours() - 2);
  }
  return now.toISOString().split("T")[0];
}

export function WarningSign() {
  const navigate = useNavigate();
  const profileId = localStorage.getItem("active_profile") || "";

 
  const [showForm, setShowForm] = useState<boolean>(() => {
    const savedDay = localStorage.getItem(`${profileId}_alert_day`);
    const savedShow = localStorage.getItem(`${profileId}_alert_show`);
    if (savedDay === getDayKey() && savedShow) {
      return JSON.parse(savedShow);
    }
    return false;
  });

 
  const [sinaisSelecionados, setSinaisSelecionados] = useState<string[]>(() => {
    const savedDay = localStorage.getItem(`${profileId}_alert_day`);
    const savedSinais = localStorage.getItem(`${profileId}_alert_sinais`);
    if (savedDay === getDayKey() && savedSinais) {
      return JSON.parse(savedSinais);
    }
    return [];
  });

  
  const [observacao, setObservacao] = useState<string>(() => {
    const savedDay = localStorage.getItem(`${profileId}_alert_day`);
    const savedObs = localStorage.getItem(`${profileId}_alert_obs`);
    if (savedDay === getDayKey() && savedObs) {
      return JSON.parse(savedObs);
    }
    return "";
  });

  
  const [records, setRecords] = useState<AlertRecord[]>(() => {
    const saved = localStorage.getItem(`${profileId}_alert_records`);
    return saved ? JSON.parse(saved) : [];
  });

 
  useEffect(() => {
    localStorage.setItem(`${profileId}_alert_day`, getDayKey());
    localStorage.setItem(`${profileId}_alert_show`, JSON.stringify(showForm));
    localStorage.setItem(`${profileId}_alert_sinais`, JSON.stringify(sinaisSelecionados));
    localStorage.setItem(`${profileId}_alert_obs`, JSON.stringify(observacao));
  }, [showForm, sinaisSelecionados, observacao]);

  // Histórico salvo separadamente — nunca apaga
  useEffect(() => {
    localStorage.setItem(`${profileId}_alert_records`, JSON.stringify(records));
  }, [records]);

  const toggleSinal = (title: string) => {
    if (sinaisSelecionados.includes(title)) {
      setSinaisSelecionados(sinaisSelecionados.filter(s => s !== title));
    } else {
      setSinaisSelecionados([...sinaisSelecionados, title]);
    }
  };

  const handleRegistrar = (semSinais: boolean = false) => {
    const now = new Date();
    const newRecord: AlertRecord = {
    id: Date.now().toString(),
    sinais: semSinais ? ["Nenhum sinal apresentado"] : sinaisSelecionados,
    observacao: semSinais ? "" : observacao,
    data: now.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit", year: "numeric" }),
    hora: now.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" }),
    };

    setRecords([newRecord, ...records]);
    setSinaisSelecionados([]);
    setObservacao("");
    setShowForm(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <div className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => navigate("/menu")}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="font-semibold text-lg">Sinais de Alerta</h1>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6 space-y-4">

        {/* Card fixo — Apresentou sinais hoje? */}
        <Card className="border-2 border-orange-200 bg-orange-50">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3 mb-4">
              <AlertTriangle className="w-6 h-6 text-orange-500 flex-shrink-0" />
              <h3 className="font-semibold text-orange-900">
                Apresentou sinais de alerta hoje?
              </h3>
            </div>

            {/* Botões de resposta */}
            {!showForm && (
              <div className="flex gap-3">
                <Button
                  className="flex-1 bg-red-600 hover:bg-red-700"
                  onClick={() => setShowForm(true)}
                >
                  Sim, tive
                </Button>
                <Button
                  variant="outline"
                  className="flex-1 border-green-500 text-green-700 hover:bg-green-50"
                  onClick={() => handleRegistrar(true)}
                >
                  Não tive
                </Button>
              </div>
            )}

            {/* Formulário com checkboxes */}
            {showForm && (
              <div className="space-y-3 mt-2">
                <label className="text-sm font-medium text-gray-700">
                  Selecione os sinais que identificou:
                </label>

                <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                  {emergencySigns.map((sign) => (
                    <div
                      key={sign.title}
                      className="flex items-center gap-3 p-2 rounded-lg hover:bg-orange-100 transition-colors cursor-pointer"
                    >
                      <Checkbox
                        id={sign.title}
                        checked={sinaisSelecionados.includes(sign.title)}
                        onCheckedChange={() => toggleSinal(sign.title)}
                      />
                      <label
                        htmlFor={sign.title}
                        className="text-sm cursor-pointer flex-1"
                        onClick={(e) => { e.preventDefault(); toggleSinal(sign.title); }}
                      >
                        <span className="font-medium">{sign.title}</span>
                        <span className="text-gray-500"> — {sign.description}</span>
                      </label>
                    </div>
                  ))}
                </div>

                {sinaisSelecionados.length > 0 && (
                  <p className="text-xs text-orange-700 font-medium">
                    {sinaisSelecionados.length} sinal(is) selecionado(s)
                  </p>
                )}

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    Observação adicional (opcional)
                  </label>
                  <textarea
                    value={observacao}
                    onChange={(e) => setObservacao(e.target.value)}
                    placeholder="Descreva o que está sentindo..."
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-orange-400 resize-none"
                    rows={3}
                  />
                </div>

                <div className="flex gap-2">
                  <Button
                    className="flex-1 bg-orange-500 hover:bg-orange-600"
                    onClick={() => handleRegistrar(false)}
                    disabled={sinaisSelecionados.length === 0}
                  >
                    Registrar
                  </Button>
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => {
                      setShowForm(false);
                      setSinaisSelecionados([]);
                      setObservacao("");
                    }}
                  >
                    Cancelar
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Histórico de registros — acumula para sempre */}
        {records.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ClipboardList className="w-5 h-5 text-orange-500" />
                Histórico de Sinais Registrados
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {records.map((record) => (
                  <div key={record.id} className="p-3 bg-orange-50 border border-orange-200 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs text-gray-500">
                        {record.data} às {record.hora}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-1 mb-2">
                      {record.sinais.map((sinal) => (
                        <span
                          key={sinal}
                          className={`text-xs px-2 py-1 rounded-full font-medium ${
                           sinal === "Nenhum sinal apresentado"
                            ? "bg-green-200 text-green-900"
                            : "bg-orange-200 text-orange-900"
                          }`}
                        >
                          {sinal}
                        </span>  
                      ))}
                    </div>
                    {record.observacao && (
                      <p className="text-sm text-gray-600 mt-1">{record.observacao}</p>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Alerta informativo */}
        <Alert className="bg-red-50 border-red-300">
          <AlertTriangle className="h-5 w-5 text-red-600" />
          <AlertDescription className="text-red-900">
            <strong>Importante:</strong> Se você apresentar qualquer um destes sinais,
            entre em contato imediatamente com sua equipe médica ou dirija-se ao hospital.
          </AlertDescription>
        </Alert>

        {/* Botão emergência */}
        <Card className="bg-gradient-to-r from-red-600 to-red-700 text-white border-0">
          <CardContent className="pt-6">
            <button
              onClick={() => navigate("/emergencia")}
              className="w-full flex items-center justify-center gap-3 py-4"
            >
              <Phone className="w-6 h-6" />
              <div className="text-left">
                <p className="font-semibold text-lg">Contatos de Emergência</p>
                <p className="text-red-100 text-sm">Toque aqui para ver números importantes</p>
              </div>
            </button>
          </CardContent>
        </Card>

        {/* Lista de sinais */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-red-600" />
              Sinais que Requerem Atenção
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {emergencySigns.map((sign, index) => (
                <div key={index} className={`p-4 rounded-lg border-2 ${getSeverityColor(sign.severity)}`}>
                  <div className="flex items-start gap-3">
                    <div className={`w-3 h-3 rounded-full mt-1 flex-shrink-0 ${getSeverityDot(sign.severity)}`} />
                    <div>
                      <h3 className="font-semibold text-gray-900">{sign.title}</h3>
                      <p className="text-sm text-gray-600 mt-1">{sign.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Legenda */}
        <Card>
          <CardContent className="pt-6">
            <h3 className="font-semibold mb-3">Legenda</h3>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500" />
                <span className="text-sm">Gravidade Alta - Requer atenção imediata</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-yellow-500" />
                <span className="text-sm">Gravidade Moderada - Entre em contato com seu médico</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quando ir ao hospital */}
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="pt-6">
            <h3 className="font-semibold mb-2 text-blue-900">Quando Ir ao Hospital:</h3>
            <p className="text-sm text-blue-800 mb-3">
              Procure atendimento de emergência imediatamente se apresentar:
            </p>
            <ul className="space-y-1 text-sm text-blue-800">
              <li>• Dificuldade para respirar</li>
              <li>• Dor no peito ou palpitações fortes</li>
              <li>• Sangramento intenso que não para</li>
              <li>• Febre alta (acima de 39°C)</li>
              <li>• Confusão ou desorientação</li>
            </ul>
          </CardContent>
        </Card>

      </div>
    </div>
  );
}