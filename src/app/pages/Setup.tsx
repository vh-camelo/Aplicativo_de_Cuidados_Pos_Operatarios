import { useState } from "react";
import { useNavigate } from "react-router";
import { Hospital, User, Calendar, Stethoscope, Pill, Phone, MapPin } from "lucide-react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";

export function Setup() {
  const navigate = useNavigate();

  const [step, setStep] = useState(1);


  const [nome, setNome] = useState("");
  const [dataCirurgia, setDataCirurgia] = useState("");
  const [tipoCirurgia, setTipoCirurgia] = useState("");


  const [medicoNome, setMedicoNome] = useState("");
  const [medicoTelefone, setMedicoTelefone] = useState("");
  const [medicoHorario, setMedicoHorario] = useState("");
  const [hospitalNome, setHospitalNome] = useState("");
  const [hospitalTelefone, setHospitalTelefone] = useState("");
  const [hospitalEndereco, setHospitalEndereco] = useState("");


//   const [profileId, setProfileId] = useState("");

  const handleNextStep = (e: React.FormEvent) => {
    e.preventDefault();
    setStep(step + 1);
  };


  const handleSaveAndNext = () => {
    const newProfileId = `profile_${Date.now()}`;

    const patientInfo = {
      nome,
      dataCirurgia,
      tipoCirurgia,
      proximaConsulta: "",
      prontuario: "Não informado",
    };

    const contacts = [
      {
        name: medicoNome || "Seu Médico",
        role: "Cirurgião Responsável",
        phone: medicoTelefone || "(00) 00000-0000",
        hours: medicoHorario || "Horário não informado",
        icon: "user",
        color: "bg-blue-500",
      },
      {
        name: hospitalNome || "Seu Hospital",
        role: "Unidade de Emergência",
        phone: hospitalTelefone || "(00) 00000-0000",
        hours: "24 horas",
        address: hospitalEndereco || "Endereço não informado",
        icon: "hospital",
        color: "bg-red-500",
      },
      {
        name: "Enfermagem",
        role: "Atendimento Pós-Operatório",
        phone: "(00) 00000-0000",
        hours: "Horário não informado",
        icon: "phone",
        color: "bg-green-500",
      },
      {
        name: "SAMU",
        role: "Emergência Médica",
        phone: "192",
        hours: "24 horas",
        icon: "phone",
        color: "bg-orange-500",
      },
      {
        name: "Bombeiros",
        role: "Corpo de Bombeiros",
        phone: "193",
        hours: "24 horas",
        icon: "phone",
        color: "bg-red-600",
      },
    ];


    localStorage.setItem(`${newProfileId}_patient_info`, JSON.stringify(patientInfo));
    localStorage.setItem(`${newProfileId}_emergency_contacts`, JSON.stringify(contacts));
    localStorage.setItem(`${newProfileId}_medications`, JSON.stringify([]));


    const savedProfiles = localStorage.getItem("profiles");
    const profiles = savedProfiles ? JSON.parse(savedProfiles) : [];
    profiles.push({ id: newProfileId, nome });
    localStorage.setItem("profiles", JSON.stringify(profiles));
    localStorage.setItem("active_profile", newProfileId);

    // setProfileId(newProfileId);
    setStep(3);
  };

  // ── TELA 1 — Dados pessoais ──────────────────────────────────────
  if (step === 1) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="space-y-1 text-center">
            <div className="mx-auto w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mb-4">
              <Hospital className="w-10 h-10 text-white" />
            </div>
            <CardTitle className="text-2xl">Novo Perfil</CardTitle>
            <CardDescription>Passo 1 de 3 — Dados pessoais</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleNextStep} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="nome">Seu Nome</Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="nome"
                    type="text"
                    placeholder="Digite seu nome completo"
                    value={nome}
                    onChange={(e) => setNome(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="dataCirurgia">Data da Cirurgia</Label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="dataCirurgia"
                    type="date"
                    value={dataCirurgia}
                    onChange={(e) => setDataCirurgia(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="tipoCirurgia">Tipo de Cirurgia</Label>
                <div className="relative">
                  <Stethoscope className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="tipoCirurgia"
                    type="text"
                    placeholder="Ex: Apendicectomia, Cesárea..."
                    value={tipoCirurgia}
                    onChange={(e) => setTipoCirurgia(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>
              <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700">
                Próximo →
              </Button>
              <Button type="button" variant="outline" className="w-full" onClick={() => navigate("/")}>
                Voltar
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  // ── TELA 2 — Médico e Hospital ───────────────────────────────────
  if (step === 2) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="space-y-1 text-center">
            <div className="mx-auto w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mb-4">
              <Phone className="w-10 h-10 text-white" />
            </div>
            <CardTitle className="text-2xl">Contatos</CardTitle>
            <CardDescription>Passo 2 de 3 — Médico e Hospital (opcional)</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">

            {/* Médico */}
            <div className="bg-blue-50 rounded-lg p-4 space-y-3">
              <h3 className="font-semibold text-blue-900 flex items-center gap-2">
                <User className="w-4 h-4" />
                Seu Médico
              </h3>
              <div className="space-y-2">
                <Label>Nome</Label>
                <Input
                  placeholder="Ex: Dr. João Silva"
                  value={medicoNome}
                  onChange={(e) => setMedicoNome(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>Telefone</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="(00) 00000-0000"
                    value={medicoTelefone}
                    onChange={(e) => setMedicoTelefone(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Horário de Atendimento</Label>
                <Input
                  placeholder="Ex: Segunda a Sexta, 8h-18h"
                  value={medicoHorario}
                  onChange={(e) => setMedicoHorario(e.target.value)}
                />
              </div>
            </div>

            {/* Hospital */}
            <div className="bg-red-50 rounded-lg p-4 space-y-3">
              <h3 className="font-semibold text-red-900 flex items-center gap-2">
                <Hospital className="w-4 h-4" />
                Seu Hospital
              </h3>
              <div className="space-y-2">
                <Label>Nome</Label>
                <Input
                  placeholder="Ex: Hospital São Lucas"
                  value={hospitalNome}
                  onChange={(e) => setHospitalNome(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>Telefone</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="(00) 00000-0000"
                    value={hospitalTelefone}
                    onChange={(e) => setHospitalTelefone(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Endereço</Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Ex: Av. Paulista, 1234 - São Paulo"
                    value={hospitalEndereco}
                    onChange={(e) => setHospitalEndereco(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
            </div>

            <Button className="w-full bg-blue-600 hover:bg-blue-700" onClick={handleSaveAndNext}>
              Próximo →
            </Button>
            <Button type="button" variant="outline" className="w-full" onClick={() => setStep(1)}>
              ← Voltar
            </Button>

          </CardContent>
        </Card>
      </div>
    );
  }

  // ── TELA 3 — Medicamentos ────────────────────────────────────────
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 text-center">
          <div className="mx-auto w-16 h-16 bg-teal-500 rounded-full flex items-center justify-center mb-4">
            <Pill className="w-10 h-10 text-white" />
          </div>
          <CardTitle className="text-2xl">Medicamentos</CardTitle>
          <CardDescription>Passo 3 de 3 — Cadastre seus medicamentos</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">

          <div className="bg-teal-50 rounded-lg p-4 text-center space-y-2">
            <Pill className="w-10 h-10 text-teal-500 mx-auto" />
            <p className="text-sm text-teal-800">
              Seu perfil foi criado! Agora você pode cadastrar seus medicamentos
              com horários e frequência de uso.
            </p>
          </div>

          <Button
            className="w-full bg-teal-500 hover:bg-teal-600"
            onClick={() => navigate("/medicamentos")}
          >
            Cadastrar Medicamentos
          </Button>

          <Button
            variant="outline"
            className="w-full"
            onClick={() => navigate("/menu")}
          >
            Pular por agora
          </Button>

        </CardContent>
      </Card>
    </div>
  );
}