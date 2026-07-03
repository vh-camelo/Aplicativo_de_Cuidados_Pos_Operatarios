import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { ArrowLeft, TrendingDown, TrendingUp, Activity } from "lucide-react";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Slider } from "../components/ui/slider";
import { Label } from "../components/ui/label";

interface PainRecord {
  id: number;
  level: number;
  time: string;
  date: string;
}

export function PainControl() {
  const navigate = useNavigate();

  const profileId = localStorage.getItem("active_profile") || "";

  const [painLevel, setPainLevel] = useState([3]);

  const [records, setRecords] = useState<PainRecord[]>(() => {
    const saved = localStorage.getItem(`${profileId}_pain_records`);
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem(`${profileId}_pain_records`, JSON.stringify(records));
  }, [records]);

  const handleSavePainLevel = () => {
    const now = new Date();
    const newRecord: PainRecord = {
      id: Date.now(),
      level: painLevel[0],
      time: now.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" }),
      date: now.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" }),
    };
    setRecords([newRecord, ...records].slice(0, 10));
  };

  const getPainColor = (level: number) => {
    if (level <= 3) return "text-green-600";
    if (level <= 6) return "text-yellow-600";
    return "text-red-600";
  };

  const getPainDescription = (level: number) => {
    if (level === 0) return "Sem dor";
    if (level <= 3) return "Dor leve";
    if (level <= 6) return "Dor moderada";
    if (level <= 8) return "Dor forte";
    return "Dor muito forte";
  };

  const currentLevel = painLevel[0];
  const averagePain = records.length > 0
    ? Math.round(records.reduce((sum, r) => sum + r.level, 0) / records.length)
    : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <div className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/menu")}
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="font-semibold text-lg">Controle da Dor</h1>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-6 space-y-4">

        {/* Registrar nível de dor */}
        <Card>
          <CardHeader>
            <CardTitle>Registrar Nível de Dor</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-center">
              <div className={`text-6xl font-bold ${getPainColor(currentLevel)}`}>
                {currentLevel}
              </div>
              <p className={`text-lg mt-2 ${getPainColor(currentLevel)}`}>
                {getPainDescription(currentLevel)}
              </p>
            </div>

            <div className="space-y-2">
              <Label>Deslize para indicar o nível de dor (0-10)</Label>
              <Slider
                value={painLevel}
                onValueChange={setPainLevel}
                max={10}
                step={1}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-gray-500">
                <span>0 - Sem dor</span>
                <span>10 - Pior dor possível</span>
              </div>
            </div>

            <Button onClick={handleSavePainLevel} className="w-full bg-blue-600 hover:bg-blue-700">
              Salvar Registro
            </Button>
          </CardContent>
        </Card>

        {/* Estatísticas — só aparece se houver registros */}
        {records.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Activity className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Média Atual</p>
                    <p className="text-2xl font-bold">{averagePain}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                    <TrendingDown className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Menor</p>
                    <p className="text-2xl font-bold">{Math.min(...records.map(r => r.level))}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                    <TrendingUp className="w-5 h-5 text-red-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Maior</p>
                    <p className="text-2xl font-bold">{Math.max(...records.map(r => r.level))}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Histórico */}
        <Card>
          <CardHeader>
            <CardTitle>Histórico de Registros</CardTitle>
          </CardHeader>
          <CardContent>
            {records.length === 0 ? (
              <p className="text-center text-gray-500 py-8">
                Nenhum registro ainda. Comece registrando seu nível de dor acima.
              </p>
            ) : (
              <div className="space-y-2">
                {records.map((record) => (
                  <div
                    key={record.id}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`text-2xl font-bold ${getPainColor(record.level)}`}>
                        {record.level}
                      </div>
                      <div>
                        <p className="text-sm font-medium">{getPainDescription(record.level)}</p>
                        <p className="text-xs text-gray-500">
                          {record.date} às {record.time}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Dicas */}
        <Card className="bg-purple-50 border-purple-200">
          <CardContent className="pt-6">
            <h3 className="font-semibold mb-2 text-purple-900">Dicas para Controle da Dor</h3>
            <ul className="space-y-1 text-sm text-purple-800">
              <li>• Tome os analgésicos conforme prescrição médica</li>
              <li>• Mantenha-se em repouso adequado</li>
              <li>• Aplique gelo ou calor conforme orientação</li>
              <li>• Se a dor for superior a 7, entre em contato com seu médico</li>
            </ul>
          </CardContent>
        </Card>

      </div>
    </div>
  );
}