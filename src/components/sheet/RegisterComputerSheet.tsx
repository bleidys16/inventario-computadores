import React, { useState } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { useInventoryStore } from '../../store/useInventoryStore';
import { X, Laptop, Plus, AlertCircle } from 'lucide-react';

export const RegisterComputerSheet: React.FC = () => {
  const { isRegisterDrawerOpen, closeRegisterDrawer, addComputer } = useInventoryStore();

  const [id, setId] = useState('');
  const [barcode, setBarcode] = useState('');
  const [name, setName] = useState('');
  const [brand, setBrand] = useState('Lenovo');
  const [model, setModel] = useState('');
  const [processor, setProcessor] = useState('');
  const [ram, setRam] = useState('');
  const [storage, setStorage] = useState('');
  const [location, setLocation] = useState('Bodega Central');
  const [notes, setNotes] = useState('');
  const [error, setError] = useState<string | null>(null);

  const resetForm = () => {
    setId('');
    setBarcode('');
    setName('');
    setBrand('Lenovo');
    setModel('');
    setProcessor('');
    setRam('');
    setStorage('');
    setLocation('Bodega Central');
    setNotes('');
    setError(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!name.trim()) {
      setError('El nombre o modelo del equipo es obligatorio.');
      return;
    }
    if (!brand.trim() || !model.trim()) {
      setError('La marca y el modelo son obligatorios.');
      return;
    }
    if (!processor.trim()) {
      setError('Por favor indica el procesador (CPU).');
      return;
    }
    if (!ram.trim() || !storage.trim()) {
      setError('La memoria RAM y el almacenamiento son requeridos.');
      return;
    }

    addComputer({
      id: id.trim() || `AST-${Math.floor(100 + Math.random() * 900)}`,
      barcode: barcode.trim() || `${Date.now()}`,
      name: name.trim(),
      brand: brand.trim(),
      model: model.trim(),
      processor: processor.trim(),
      ram: ram.trim(),
      storage: storage.trim(),
      location: location.trim() || 'Bodega Central',
      notes: notes.trim() || undefined,
    });

    resetForm();
    closeRegisterDrawer();
  };

  return (
    <Dialog.Root open={isRegisterDrawerOpen} onOpenChange={(open) => !open && closeRegisterDrawer()}>
      <Dialog.Portal>
        {/* Overlay translúcido */}
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/70 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />

        {/* Panel lateral derecho (Drawer/Sheet) */}
        <Dialog.Content className="fixed inset-y-0 right-0 z-50 w-full max-w-md bg-[#2B124C] border-l border-[#522B5B] shadow-2xl flex flex-col justify-between p-0 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right duration-300 ease-out focus:outline-none text-[#FBE4D8]">
          
          {/* Header del Drawer */}
          <div className="p-5 border-b border-[#522B5B] bg-[#190019] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded bg-[#2B124C] border border-[#522B5B] flex items-center justify-center text-[#DFB6B2]">
                <Laptop className="w-5 h-5" />
              </div>
              <div>
                <Dialog.Title className="text-sm font-mono uppercase tracking-wider font-semibold text-[#FBE4D8]">
                  Registrar Equipo
                </Dialog.Title>
                <Dialog.Description className="text-xs text-[#DFB6B2]">
                  Añade un equipo a la base de datos de inventario
                </Dialog.Description>
              </div>
            </div>

            <Dialog.Close asChild>
              <button
                type="button"
                className="p-1.5 rounded text-[#DFB6B2] hover:text-[#FBE4D8] hover:bg-[#522B5B] transition"
                aria-label="Cerrar panel"
              >
                <X className="w-4 h-4" />
              </button>
            </Dialog.Close>
          </div>

          {/* Formulario */}
          <form id="register-computer-form" onSubmit={handleSubmit} className="p-5 space-y-3.5 overflow-y-auto flex-1 text-xs">
            {error && (
              <div className="p-2.5 rounded bg-rose-950/60 border border-rose-500/40 text-rose-300 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
                <span>{error}</span>
              </div>
            )}

            {/* Código / ID y Código de Barras */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-mono uppercase text-[#DFB6B2] mb-1">
                  Código / ID
                </label>
                <input
                  type="text"
                  value={id}
                  onChange={(e) => setId(e.target.value)}
                  placeholder="Ej: AST-107"
                  className="w-full px-2.5 py-1.5 rounded bg-[#190019] border border-[#522B5B] text-[#FBE4D8] font-mono text-xs focus:outline-none focus:border-[#DFB6B2]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono uppercase text-[#DFB6B2] mb-1">
                  Código de Barras
                </label>
                <input
                  type="text"
                  value={barcode}
                  onChange={(e) => setBarcode(e.target.value)}
                  placeholder="Ej: 770928374077"
                  className="w-full px-2.5 py-1.5 rounded bg-[#190019] border border-[#522B5B] text-[#FBE4D8] font-mono text-xs focus:outline-none focus:border-[#DFB6B2]"
                />
              </div>
            </div>

            {/* Nombre del Equipo */}
            <div>
              <label className="block text-[11px] font-mono uppercase text-[#DFB6B2] mb-1">
                Nombre del Equipo *
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ej: MacBook Pro 14, Dell Latitude 5540..."
                required
                className="w-full px-2.5 py-1.5 rounded bg-[#190019] border border-[#522B5B] text-[#FBE4D8] text-xs focus:outline-none focus:border-[#DFB6B2]"
              />
            </div>

            {/* Marca y Modelo */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-mono uppercase text-[#DFB6B2] mb-1">
                  Marca *
                </label>
                <select
                  value={brand}
                  onChange={(e) => setBrand(e.target.value)}
                  className="w-full px-2.5 py-1.5 rounded bg-[#190019] border border-[#522B5B] text-[#FBE4D8] text-xs focus:outline-none focus:border-[#DFB6B2]"
                >
                  <option value="Apple">Apple</option>
                  <option value="Dell">Dell</option>
                  <option value="Lenovo">Lenovo</option>
                  <option value="HP">HP</option>
                  <option value="ASUS">ASUS</option>
                  <option value="Acer">Acer</option>
                  <option value="Otra">Otra</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-mono uppercase text-[#DFB6B2] mb-1">
                  Modelo *
                </label>
                <input
                  type="text"
                  value={model}
                  onChange={(e) => setModel(e.target.value)}
                  placeholder="Ej: Latitude 5540, ThinkPad..."
                  required
                  className="w-full px-2.5 py-1.5 rounded bg-[#190019] border border-[#522B5B] text-[#FBE4D8] text-xs focus:outline-none focus:border-[#DFB6B2]"
                />
              </div>
            </div>

            {/* Procesador (CPU) */}
            <div>
              <label className="block text-[11px] font-mono uppercase text-[#DFB6B2] mb-1">
                Procesador (CPU) *
              </label>
              <input
                type="text"
                value={processor}
                onChange={(e) => setProcessor(e.target.value)}
                placeholder="Ej: Intel Core i7-1365U, AMD Ryzen 7..."
                required
                className="w-full px-2.5 py-1.5 rounded bg-[#190019] border border-[#522B5B] text-[#FBE4D8] text-xs focus:outline-none focus:border-[#DFB6B2]"
              />
            </div>

            {/* RAM y Almacenamiento */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-mono uppercase text-[#DFB6B2] mb-1">
                  Memoria RAM *
                </label>
                <input
                  type="text"
                  value={ram}
                  onChange={(e) => setRam(e.target.value)}
                  placeholder="Ej: 16 GB DDR5"
                  required
                  className="w-full px-2.5 py-1.5 rounded bg-[#190019] border border-[#522B5B] text-[#FBE4D8] text-xs focus:outline-none focus:border-[#DFB6B2]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono uppercase text-[#DFB6B2] mb-1">
                  Almacenamiento *
                </label>
                <input
                  type="text"
                  value={storage}
                  onChange={(e) => setStorage(e.target.value)}
                  placeholder="Ej: 512 GB NVMe SSD"
                  required
                  className="w-full px-2.5 py-1.5 rounded bg-[#190019] border border-[#522B5B] text-[#FBE4D8] text-xs focus:outline-none focus:border-[#DFB6B2]"
                />
              </div>
            </div>

            {/* Ubicación Inicial */}
            <div>
              <label className="block text-[11px] font-mono uppercase text-[#DFB6B2] mb-1">
                Ubicación Inicial
              </label>
              <select
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full px-2.5 py-1.5 rounded bg-[#190019] border border-[#522B5B] text-[#FBE4D8] text-xs focus:outline-none focus:border-[#DFB6B2]"
              >
                <option value="Bodega Central">Bodega Central</option>
                <option value="Sede Medellín - Centro Tecnológico">Sede Medellín - Centro Tecnológico</option>
                <option value="Sede Bogotá - Campus Financiero">Sede Bogotá - Campus Financiero</option>
                <option value="Sede Cali - Centro de Desarrollo">Sede Cali - Centro de Desarrollo</option>
                <option value="Sede Barranquilla - Operaciones">Sede Barranquilla - Operaciones</option>
              </select>
            </div>

            {/* Notas opcionales */}
            <div>
              <label className="block text-[11px] font-mono uppercase text-[#DFB6B2] mb-1">
                Notas / Observaciones
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Detalles sobre cargador, estado físico o procedencia..."
                rows={3}
                className="w-full px-2.5 py-1.5 rounded bg-[#190019] border border-[#522B5B] text-[#FBE4D8] text-xs focus:outline-none focus:border-[#DFB6B2] resize-none placeholder-[#DFB6B2]/40"
              />
            </div>
          </form>

          {/* Footer del Drawer */}
          <div className="p-4 border-t border-[#522B5B] bg-[#190019] flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={closeRegisterDrawer}
              className="px-3.5 py-1.5 rounded border border-[#522B5B] bg-[#190019] hover:bg-[#522B5B] text-[#DFB6B2] text-xs font-mono transition"
            >
              Cancelar
            </button>
            <button
              type="submit"
              form="register-computer-form"
              className="px-4 py-1.5 rounded bg-[#FBE4D8] hover:bg-[#DFB6B2] text-[#190019] font-mono font-semibold text-xs transition shadow-sm flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
              <span>Guardar en Inventario</span>
            </button>
          </div>

        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};
