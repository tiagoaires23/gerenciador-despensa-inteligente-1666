"use client"

import { useState, useEffect } from "react"
import { Plus, Search, Filter, Bell, ShoppingCart, ChefHat, Calendar, AlertTriangle, Sparkles, Crown, Lock, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

type PantryItem = {
  id: string
  name: string
  quantity: number
  unit: string
  category: string
  expiryDate: string
  daysUntilExpiry: number
}

type Recipe = {
  id: string
  name: string
  ingredients: string[]
  matchPercentage: number
  difficulty: string
  time: string
}

export default function Home() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [trialDaysLeft, setTrialDaysLeft] = useState(7)
  const [isTrialExpired, setIsTrialExpired] = useState(false)
  const [showUpgradeModal, setShowUpgradeModal] = useState(false)
  const [showPricingModal, setShowPricingModal] = useState(false)

  // Simular contagem regressiva do trial (em produção, viria do backend)
  useEffect(() => {
    // Verificar localStorage para data de início do trial
    const trialStartDate = localStorage.getItem('trialStartDate')
    
    if (!trialStartDate) {
      // Primeira vez - iniciar trial
      localStorage.setItem('trialStartDate', new Date().toISOString())
      setTrialDaysLeft(7)
    } else {
      // Calcular dias restantes
      const start = new Date(trialStartDate)
      const now = new Date()
      const diffTime = now.getTime() - start.getTime()
      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))
      const daysLeft = 7 - diffDays

      if (daysLeft <= 0) {
        setIsTrialExpired(true)
        setTrialDaysLeft(0)
      } else {
        setTrialDaysLeft(daysLeft)
      }
    }
  }, [])

  // Mock data - Em produção, viria de um banco de dados
  const [pantryItems] = useState<PantryItem[]>([
    { id: "1", name: "Leite", quantity: 2, unit: "L", category: "Laticínios", expiryDate: "2025-01-25", daysUntilExpiry: 3 },
    { id: "2", name: "Ovos", quantity: 12, unit: "unid", category: "Laticínios", expiryDate: "2025-01-28", daysUntilExpiry: 6 },
    { id: "3", name: "Tomate", quantity: 5, unit: "unid", category: "Vegetais", expiryDate: "2025-01-24", daysUntilExpiry: 2 },
    { id: "4", name: "Frango", quantity: 1, unit: "kg", category: "Carnes", expiryDate: "2025-01-23", daysUntilExpiry: 1 },
    { id: "5", name: "Arroz", quantity: 2, unit: "kg", category: "Grãos", expiryDate: "2026-01-22", daysUntilExpiry: 365 },
    { id: "6", name: "Feijão", quantity: 1, unit: "kg", category: "Grãos", expiryDate: "2026-01-22", daysUntilExpiry: 365 },
  ])

  const [recipes] = useState<Recipe[]>([
    { id: "1", name: "Omelete Caprese", ingredients: ["Ovos", "Tomate", "Queijo"], matchPercentage: 85, difficulty: "Fácil", time: "15 min" },
    { id: "2", name: "Frango Grelhado com Legumes", ingredients: ["Frango", "Tomate", "Cebola"], matchPercentage: 75, difficulty: "Médio", time: "30 min" },
    { id: "3", name: "Arroz com Feijão Tradicional", ingredients: ["Arroz", "Feijão", "Alho"], matchPercentage: 90, difficulty: "Fácil", time: "40 min" },
  ])

  const categories = ["all", "Laticínios", "Vegetais", "Carnes", "Grãos", "Frutas"]

  const filteredItems = pantryItems.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === "all" || item.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const expiringItems = pantryItems.filter(item => item.daysUntilExpiry <= 3)

  const getExpiryColor = (days: number) => {
    if (days < 0) return "text-red-600 bg-red-50 border-red-200"
    if (days <= 3) return "text-orange-600 bg-orange-50 border-orange-200"
    if (days <= 7) return "text-yellow-600 bg-yellow-50 border-yellow-200"
    return "text-green-600 bg-green-50 border-green-200"
  }

  const handleLockedFeature = () => {
    setShowUpgradeModal(true)
  }

  // Overlay de bloqueio quando trial expirado
  if (isTrialExpired) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center p-4">
        <Card className="max-w-md w-full shadow-2xl border-amber-200">
          <CardHeader className="text-center space-y-4">
            <div className="mx-auto bg-gradient-to-br from-amber-500 to-orange-600 p-4 rounded-full w-20 h-20 flex items-center justify-center">
              <Lock className="w-10 h-10 text-white" />
            </div>
            <div>
              <CardTitle className="text-2xl mb-2">Período de Teste Expirado</CardTitle>
              <CardDescription className="text-base">
                Seu período de 7 dias de experiência gratuita terminou
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="bg-gradient-to-r from-amber-50 to-orange-50 p-6 rounded-lg border-2 border-amber-200">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Crown className="w-6 h-6 text-amber-600" />
                  <h3 className="font-bold text-xl text-amber-900">Plano Premium</h3>
                </div>
                <div className="text-right">
                  <p className="text-3xl font-bold text-amber-600">R$ 19,90</p>
                  <p className="text-sm text-gray-600">/mês</p>
                </div>
              </div>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <div className="bg-emerald-100 p-1 rounded-full mt-0.5">
                    <Sparkles className="w-4 h-4 text-emerald-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">Receitas Ilimitadas</p>
                    <p className="text-sm text-gray-600">Mais de 10.000 receitas inteligentes</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="bg-emerald-100 p-1 rounded-full mt-0.5">
                    <Bell className="w-4 h-4 text-emerald-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">Notificações Inteligentes</p>
                    <p className="text-sm text-gray-600">Alertas de validade personalizados</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="bg-emerald-100 p-1 rounded-full mt-0.5">
                    <ShoppingCart className="w-4 h-4 text-emerald-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">Lista de Compras Automática</p>
                    <p className="text-sm text-gray-600">Geração baseada no seu consumo</p>
                  </div>
                </li>
              </ul>
            </div>
            <Button 
              className="w-full bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white font-bold py-6 text-lg shadow-lg"
              onClick={() => alert('Redirecionando para pagamento...')}
            >
              <Crown className="w-5 h-5 mr-2" />
              Assinar Plano Premium
            </Button>
            <p className="text-center text-sm text-gray-500">
              Cancele quando quiser • Sem compromisso
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50">
      {/* Header Premium */}
      <header className="bg-black/90 backdrop-blur-md border-b border-gray-800 sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex-1 flex items-center justify-center gap-3">
              <div className="bg-gradient-to-br from-orange-500 to-green-600 p-3 rounded-xl shadow-lg flex items-center justify-center w-12 h-12">
                <span className="text-white font-bold text-xl" style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.8), -1px -1px 2px rgba(0,0,0,0.6)' }}>SK</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white" style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.8), -1px -1px 2px rgba(0,0,0,0.6)' }}>
                  Smart Kitchen
                </h1>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" className="relative text-white hover:bg-white/10">
                <Bell className="w-5 h-5" />
                {expiringItems.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-gradient-to-br from-orange-500 to-green-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {expiringItems.length}
                  </span>
                )}
              </Button>
              <Button variant="ghost" size="icon" className="text-white hover:bg-white/10">
                <ShoppingCart className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 space-y-6">
        {/* Alerta de Trial */}
        {trialDaysLeft <= 3 && (
          <Alert className="border-amber-300 bg-gradient-to-r from-amber-50 to-orange-50">
            <Clock className="h-5 w-5 text-amber-600" />
            <AlertTitle className="text-amber-900 font-bold">
              Seu período de teste está acabando!
            </AlertTitle>
            <AlertDescription className="text-amber-800">
              Restam apenas {trialDaysLeft} {trialDaysLeft === 1 ? 'dia' : 'dias'} do seu trial gratuito. 
              Assine agora para continuar aproveitando todos os recursos premium.
              <Button 
                className="mt-3 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white"
                onClick={() => setShowUpgradeModal(true)}
              >
                <Crown className="w-4 h-4 mr-2" />
                Ver Planos
              </Button>
            </AlertDescription>
          </Alert>
        )}

        {/* Alertas de Validade */}
        {expiringItems.length > 0 && (
          <Card className="border-orange-200 bg-gradient-to-r from-orange-50 to-amber-50 shadow-lg">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-orange-600" />
                <CardTitle className="text-orange-900">Alertas de Validade</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {expiringItems.map(item => (
                  <div key={item.id} className="flex items-center justify-between p-3 bg-white rounded-lg border border-orange-100">
                    <div>
                      <p className="font-semibold text-gray-900">{item.name}</p>
                      <p className="text-sm text-gray-600">
                        {item.daysUntilExpiry < 0 
                          ? `Vencido há ${Math.abs(item.daysUntilExpiry)} dias` 
                          : `Vence em ${item.daysUntilExpiry} ${item.daysUntilExpiry === 1 ? 'dia' : 'dias'}`
                        }
                      </p>
                    </div>
                    <Badge variant="outline" className={getExpiryColor(item.daysUntilExpiry)}>
                      {item.daysUntilExpiry < 0 ? "Vencido" : "Urgente"}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Tabs Principal */}
        <Tabs defaultValue="pantry" className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-white shadow-sm">
            <TabsTrigger value="pantry" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-emerald-500 data-[state=active]:to-teal-600 data-[state=active]:text-white">
              <Calendar className="w-4 h-4 mr-2" />
              Minha Despensa
            </TabsTrigger>
            <TabsTrigger value="recipes" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-emerald-500 data-[state=active]:to-teal-600 data-[state=active]:text-white">
              <Sparkles className="w-4 h-4 mr-2" />
              Receitas Inteligentes
            </TabsTrigger>
          </TabsList>

          {/* Tab Despensa */}
          <TabsContent value="pantry" className="space-y-4 mt-6">
            {/* Busca e Filtros */}
            <Card className="shadow-lg border-emerald-100">
              <CardContent className="pt-6">
                <div className="flex flex-col sm:flex-row gap-3">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      placeholder="Buscar item na despensa..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger className="w-full sm:w-[180px]">
                      <Filter className="w-4 h-4 mr-2" />
                      <SelectValue placeholder="Categoria" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todas</SelectItem>
                      {categories.filter(c => c !== "all").map(cat => (
                        <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                    <DialogTrigger asChild>
                      <Button className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 shadow-lg">
                        <Plus className="w-4 h-4 mr-2" />
                        Adicionar Item
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Adicionar Item à Despensa</DialogTitle>
                        <DialogDescription>
                          Registre um novo item com data de validade
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4 py-4">
                        <div className="space-y-2">
                          <Label htmlFor="name">Nome do Item</Label>
                          <Input id="name" placeholder="Ex: Leite integral" />
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <div className="space-y-2">
                            <Label htmlFor="quantity">Quantidade</Label>
                            <Input id="quantity" type="number" placeholder="1" />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="unit">Unidade</Label>
                            <Select>
                              <SelectTrigger id="unit">
                                <SelectValue placeholder="Selecione" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="unid">Unidade</SelectItem>
                                <SelectItem value="kg">Kg</SelectItem>
                                <SelectItem value="g">Gramas</SelectItem>
                                <SelectItem value="L">Litros</SelectItem>
                                <SelectItem value="ml">ml</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="category">Categoria</Label>
                          <Select>
                            <SelectTrigger id="category">
                              <SelectValue placeholder="Selecione" />
                            </SelectTrigger>
                            <SelectContent>
                              {categories.filter(c => c !== "all").map(cat => (
                                <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="expiry">Data de Validade</Label>
                          <Input id="expiry" type="date" />
                        </div>
                        <Button className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700">
                          Adicionar à Despensa
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardContent>
            </Card>

            {/* Lista de Itens */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredItems.map(item => (
                <Card key={item.id} className="hover:shadow-xl transition-all duration-300 border-emerald-100">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-lg">{item.name}</CardTitle>
                        <CardDescription>{item.category}</CardDescription>
                      </div>
                      <Badge variant="outline" className={getExpiryColor(item.daysUntilExpiry)}>
                        {item.daysUntilExpiry < 0 
                          ? "Vencido" 
                          : item.daysUntilExpiry <= 3 
                            ? "Urgente" 
                            : `${item.daysUntilExpiry}d`
                        }
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Quantidade:</span>
                        <span className="font-semibold">{item.quantity} {item.unit}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Validade:</span>
                        <span className="font-semibold">{new Date(item.expiryDate).toLocaleDateString('pt-BR')}</span>
                      </div>
                      <div className="flex gap-2 mt-4">
                        <Button variant="outline" size="sm" className="flex-1">
                          Consumir
                        </Button>
                        <Button variant="outline" size="sm" className="flex-1 text-red-600 hover:text-red-700">
                          Remover
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {filteredItems.length === 0 && (
              <Card className="border-dashed border-2 border-gray-300">
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <Calendar className="w-12 h-12 text-gray-400 mb-4" />
                  <p className="text-gray-600 text-center">
                    Nenhum item encontrado na despensa
                  </p>
                  <Button 
                    variant="outline" 
                    className="mt-4"
                    onClick={() => setIsAddDialogOpen(true)}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Adicionar Primeiro Item
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Tab Receitas */}
          <TabsContent value="recipes" className="space-y-4 mt-6">
            <Card className="border-purple-200 bg-gradient-to-r from-purple-50 to-pink-50 shadow-lg">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-purple-600" />
                  <CardTitle className="text-purple-900">Receitas Inteligentes</CardTitle>
                </div>
                <CardDescription className="text-purple-700">
                  Sugestões baseadas nos ingredientes da sua despensa
                </CardDescription>
              </CardHeader>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {recipes.map(recipe => (
                <Card key={recipe.id} className="hover:shadow-xl transition-all duration-300 border-emerald-100">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-lg">{recipe.name}</CardTitle>
                        <CardDescription>{recipe.difficulty} • {recipe.time}</CardDescription>
                      </div>
                      <Badge className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white">
                        {recipe.matchPercentage}% Match
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div>
                        <p className="text-sm font-semibold text-gray-700 mb-2">Ingredientes necessários:</p>
                        <div className="flex flex-wrap gap-2">
                          {recipe.ingredients.map((ing, idx) => (
                            <Badge key={idx} variant="outline" className="bg-white">
                              {ing}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <Button className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700">
                        Ver Receita Completa
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Funcionalidades Premium */}
            <Card className="border-amber-200 bg-gradient-to-r from-amber-50 to-yellow-50 shadow-lg">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Crown className="w-5 h-5 text-amber-600" />
                  <CardTitle className="text-amber-900">Funcionalidades Premium</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <div className="bg-emerald-100 p-1 rounded-full mt-0.5">
                      <Sparkles className="w-4 h-4 text-emerald-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">Receitas Ilimitadas</p>
                      <p className="text-sm text-gray-600">Acesso a mais de 10.000 receitas inteligentes</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="bg-emerald-100 p-1 rounded-full mt-0.5">
                      <Bell className="w-4 h-4 text-emerald-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">Notificações Inteligentes</p>
                      <p className="text-sm text-gray-600">Alertas personalizados de validade e sugestões</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="bg-emerald-100 p-1 rounded-full mt-0.5">
                      <ShoppingCart className="w-4 h-4 text-emerald-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">Lista de Compras Automática</p>
                      <p className="text-sm text-gray-600">Geração inteligente baseada no seu consumo</p>
                    </div>
                  </li>
                </ul>
                <Button 
                  className="w-full mt-6 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white font-bold"
                  onClick={() => setShowUpgradeModal(true)}
                >
                  <Crown className="w-4 h-4 mr-2" />
                  Assinar Premium Agora
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>

      {/* Modal de Upgrade */}
      <Dialog open={showUpgradeModal} onOpenChange={setShowUpgradeModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-2xl flex items-center gap-2">
              <Crown className="w-6 h-6 text-amber-500" />
              Assine o Plano Premium
            </DialogTitle>
            <DialogDescription>
              Continue aproveitando todos os recursos após o período de teste
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-6 py-4">
            <div className="bg-gradient-to-r from-amber-50 to-orange-50 p-6 rounded-lg border-2 border-amber-200">
              <div className="text-center mb-4">
                <p className="text-4xl font-bold text-amber-600">R$ 19,90</p>
                <p className="text-sm text-gray-600">/mês</p>
              </div>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <div className="bg-emerald-100 p-1 rounded-full mt-0.5">
                    <Sparkles className="w-4 h-4 text-emerald-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">Receitas Ilimitadas</p>
                    <p className="text-sm text-gray-600">Mais de 10.000 receitas</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="bg-emerald-100 p-1 rounded-full mt-0.5">
                    <Bell className="w-4 h-4 text-emerald-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">Notificações Inteligentes</p>
                    <p className="text-sm text-gray-600">Alertas personalizados</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="bg-emerald-100 p-1 rounded-full mt-0.5">
                    <ShoppingCart className="w-4 h-4 text-emerald-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">Lista de Compras Automática</p>
                    <p className="text-sm text-gray-600">Geração inteligente</p>
                  </div>
                </li>
              </ul>
            </div>
            <Button 
              className="w-full bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white font-bold py-6 text-lg"
              onClick={() => setShowPricingModal(true)}
            >
              <Crown className="w-5 h-5 mr-2" />
              Ver Opções de Pagamento
            </Button>
            <p className="text-center text-sm text-gray-500">
              Cancele quando quiser • Sem compromisso
            </p>
          </div>
        </DialogContent>
      </Dialog>

      {/* Modal de Preços */}
      <Dialog open={showPricingModal} onOpenChange={setShowPricingModal}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle className="text-2xl text-center flex items-center justify-center gap-2">
              <Crown className="w-6 h-6 text-amber-500" />
              Escolha seu Plano Premium
            </DialogTitle>
            <DialogDescription className="text-center">
              Selecione a melhor opção de pagamento para você
            </DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 py-6">
            {/* Plano Semanal */}
            <Card className="border-2 border-gray-200 hover:border-amber-400 transition-all hover:shadow-lg">
              <CardHeader className="text-center pb-4">
                <CardTitle className="text-lg">Semanal</CardTitle>
                <div className="mt-4">
                  <p className="text-3xl font-bold text-gray-900">R$ 6,90</p>
                  <p className="text-sm text-gray-600">/semana</p>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    <div className="bg-emerald-100 p-0.5 rounded-full">
                      <Sparkles className="w-3 h-3 text-emerald-600" />
                    </div>
                    <span>Todos os recursos Premium</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="bg-emerald-100 p-0.5 rounded-full">
                      <Sparkles className="w-3 h-3 text-emerald-600" />
                    </div>
                    <span>Cancele quando quiser</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="bg-emerald-100 p-0.5 rounded-full">
                      <Sparkles className="w-3 h-3 text-emerald-600" />
                    </div>
                    <span>Renovação automática</span>
                  </li>
                </ul>
                <Button 
                  className="w-full bg-gray-900 hover:bg-gray-800 text-white"
                  onClick={() => alert('Processando pagamento semanal...')}
                >
                  Assinar Semanal
                </Button>
              </CardContent>
            </Card>

            {/* Plano Mensal - Destaque */}
            <Card className="border-2 border-amber-400 shadow-xl relative">
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <Badge className="bg-gradient-to-r from-amber-500 to-orange-600 text-white px-4 py-1">
                  Mais Popular
                </Badge>
              </div>
              <CardHeader className="text-center pb-4 pt-6">
                <CardTitle className="text-lg">Mensal</CardTitle>
                <div className="mt-4">
                  <p className="text-4xl font-bold text-amber-600">R$ 19,90</p>
                  <p className="text-sm text-gray-600">/mês</p>
                  <p className="text-xs text-emerald-600 font-semibold mt-1">Economize 28%</p>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    <div className="bg-emerald-100 p-0.5 rounded-full">
                      <Sparkles className="w-3 h-3 text-emerald-600" />
                    </div>
                    <span>Todos os recursos Premium</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="bg-emerald-100 p-0.5 rounded-full">
                      <Sparkles className="w-3 h-3 text-emerald-600" />
                    </div>
                    <span>Cancele quando quiser</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="bg-emerald-100 p-0.5 rounded-full">
                      <Sparkles className="w-3 h-3 text-emerald-600" />
                    </div>
                    <span>Suporte prioritário</span>
                  </li>
                </ul>
                <Button 
                  className="w-full bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white font-bold"
                  onClick={() => alert('Processando pagamento mensal...')}
                >
                  Assinar Mensal
                </Button>
              </CardContent>
            </Card>

            {/* Plano Anual */}
            <Card className="border-2 border-emerald-300 hover:border-emerald-500 transition-all hover:shadow-lg">
              <CardHeader className="text-center pb-4">
                <CardTitle className="text-lg">Anual</CardTitle>
                <div className="mt-4">
                  <p className="text-3xl font-bold text-emerald-600">R$ 179,90</p>
                  <p className="text-sm text-gray-600">/ano</p>
                  <p className="text-xs text-emerald-600 font-semibold mt-1">Economize 62%</p>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    <div className="bg-emerald-100 p-0.5 rounded-full">
                      <Sparkles className="w-3 h-3 text-emerald-600" />
                    </div>
                    <span>Todos os recursos Premium</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="bg-emerald-100 p-0.5 rounded-full">
                      <Sparkles className="w-3 h-3 text-emerald-600" />
                    </div>
                    <span>Melhor custo-benefício</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="bg-emerald-100 p-0.5 rounded-full">
                      <Sparkles className="w-3 h-3 text-emerald-600" />
                    </div>
                    <span>Suporte VIP</span>
                  </li>
                </ul>
                <Button 
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white"
                  onClick={() => alert('Processando pagamento anual...')}
                >
                  Assinar Anual
                </Button>
              </CardContent>
            </Card>
          </div>
          <p className="text-center text-sm text-gray-500 pb-2">
            Todos os planos incluem período de teste gratuito • Cancele quando quiser
          </p>
        </DialogContent>
      </Dialog>

      {/* Footer */}
      <footer className="bg-black/90 backdrop-blur-md border-t border-gray-800 mt-12">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col items-center justify-center gap-4">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-amber-500" />
              <span className="text-sm font-semibold text-white" style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.8), -1px -1px 2px rgba(0,0,0,0.6)' }}>
                Período de Experimentação: {trialDaysLeft} {trialDaysLeft === 1 ? 'dia' : 'dias'} restantes
              </span>
            </div>
            <Button 
              variant="link" 
              className="text-sm text-amber-400 hover:text-amber-300 underline"
              onClick={() => setShowPricingModal(true)}
            >
              Planos Premium - Clique Aqui
            </Button>
          </div>
        </div>
      </footer>
    </div>
  )
}
