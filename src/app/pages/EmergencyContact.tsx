import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { ArrowLeft, Phone, Hospital, User, Clock, MapPin } from "lucide-react";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Alert, AlertDescription } from "../components/ui/alert";

interface Contact {
  name: string;
  role: string;
  phone: string;
  hours: string;
  address?: string;
  icon: "user" | "hospital" | "phone";
  color: string;
}

interface PatientInfo {
  // prontuario: string;
  dataCirurgia: string;
  tipoCirurgia: string;
  proximaConsulta: string;
}

const defaultContacts: Contact[] = [
  {
    name: "Seu Médico",
    role: "Cirurgião Responsável",
    phone: "(00) 00000-0000",
    hours: "Horário não informado",
    icon: "user",
    color: "bg-blue-500",
  },
  {
    name: "Seu Hospital",
    role: "Unidade de Emergência",
    phone: "(00) 00000-0000",
    hours: "24 horas",
    address: "Endereço não informado",
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
    name: "BOMBEIROS",
    role: "BOMBEIROS",
    phone: "193",
    hours: "24 horas",
    icon: "phone",
    color: "bg-red-500",
  },
];

const defaultPatientInfo: PatientInfo = {
  // prontuario: "Não informado",
  dataCirurgia: "Não informada",
  tipoCirurgia: "Não informado",
  proximaConsulta: "Não informada",
};

function getIcon(type: Contact["icon"]) {
  if (type === "user") return User;
  if (type === "hospital") return Hospital;
  return Phone;
}

export function EmergencyContact() {
  const navigate = useNavigate();

  // Pega o ID do perfil ativo
  const profileId = localStorage.getItem("active_profile") || "";

  const [contacts, setContacts] = useState<Contact[]>(() => {
    const saved = localStorage.getItem(`${profileId}_emergency_contacts`);
    return saved ? JSON.parse(saved) : defaultContacts;
  });

  const [patientInfo, setPatientInfo] = useState<PatientInfo>(() => {
    const saved = localStorage.getItem(`${profileId}_patient_info`);
    return saved ? JSON.parse(saved) : defaultPatientInfo;
  });

  useEffect(() => {
    localStorage.setItem(`${profileId}_emergency_contacts`, JSON.stringify(contacts));
  }, [contacts]);

  useEffect(() => {
    localStorage.setItem(`${profileId}_patient_info`, JSON.stringify(patientInfo));
  }, [patientInfo]);

  const handleCall = (phone: string) => {
    window.location.href = `tel:${phone.replace(/\D/g, "")}`;
  };

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
          <h1 className="font-semibold text-lg">Contatos de Emergência</h1>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-6 space-y-4">

        {/* Alerta de emergência */}
        <Alert className="bg-red-50 border-red-300">
          <Phone className="h-5 w-5 text-red-600" />
          <AlertDescription className="text-red-900">
            <strong>Em caso de emergência:</strong> Ligue imediatamente para o SAMU (192)
            ou dirija-se ao hospital mais próximo.
          </AlertDescription>
        </Alert>

        {/* Cards de contato */}
        <div className="space-y-4">
          {contacts.map((contact, index) => {
            const Icon = getIcon(contact.icon);
            return (
              <Card key={index} className="overflow-hidden">
                <CardContent className="p-0">
                  <div className="flex">
                    <div className={`${contact.color} w-2 flex-shrink-0`} />
                    <div className="flex-1 p-6">
                      <div className="flex items-start gap-3 mb-4">
                        <div className={`${contact.color} w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0`}>
                          <Icon className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-lg">{contact.name}</h3>
                          <p className="text-sm text-gray-600">{contact.role}</p>
                        </div>
                      </div>

                      <div className="space-y-2 mb-4">
                        <div className="flex items-center gap-2 text-gray-600">
                          <Phone className="w-4 h-4" />
                          <span className="text-lg font-semibold">{contact.phone}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                          <Clock className="w-4 h-4" />
                          <span>{contact.hours}</span>
                        </div>
                        {contact.address && (
                          <div className="flex items-center gap-2 text-sm text-gray-500">
                            <MapPin className="w-4 h-4" />
                            <span>{contact.address}</span>
                          </div>
                        )}
                      </div>

                      <Button
                        onClick={() => handleCall(contact.phone)}
                        className={`w-full ${contact.color} hover:opacity-90`}
                      >
                        <Phone className="w-4 h-4 mr-2" />
                        Ligar Agora
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Localização do hospital */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="w-5 h-5" />
              Localização do Hospital
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <p className="font-semibold">{contacts[1].name}</p>
              <p className="text-sm text-gray-600">
                {contacts[1].address || "Endereço não informado"}
              </p>
            </div>
            <Button
              variant="outline"
              className="w-full"
              onClick={() =>
                window.open(
                  `https://maps.google.com/search?q=${encodeURIComponent(contacts[1].address || contacts[1].name)}`,
                  "_blank"
                )
              }
            >
              <MapPin className="w-4 h-4 mr-2" />
              Ver no Mapa
            </Button>
          </CardContent>
        </Card>

        {/* Notas importantes */}
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="pt-6">
            <h3 className="font-semibold mb-2 text-blue-900">Notas Importantes</h3>
            <ul className="space-y-1 text-sm text-blue-800">
              <li>• Mantenha estes contatos salvos no seu celular</li>
              <li>• Em emergências graves, ligue 192 (SAMU) imediatamente</li>
              <li>• Tenha seu número de prontuário em mãos ao ligar</li>
              <li>• Não hesite em buscar ajuda se tiver dúvidas</li>
            </ul>
          </CardContent>
        </Card>

        {/* Informações do paciente */}
        <Card>
          <CardHeader>
            <CardTitle>Suas Informações</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            {/* <div className="flex justify-between">
              <span className="text-gray-600">Número do Prontuário:</span>
              <span className="font-semibold">{patientInfo.prontuario}</span>
            </div> */}
            <div className="flex justify-between">
              <span className="text-gray-600">Data da Cirurgia:</span>
              <span className="font-semibold">{patientInfo.dataCirurgia}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Tipo de Cirurgia:</span>
              <span className="font-semibold">{patientInfo.tipoCirurgia}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Próxima Consulta:</span>
              <span className="font-semibold">{patientInfo.proximaConsulta}</span>
            </div>
          </CardContent>
        </Card>

      </div>
    </div>
  );
}

