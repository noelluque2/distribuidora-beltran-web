-- ============================================================
-- Vista pública de catálogo para la web institucional
-- ============================================================
-- Objetivo: exponer SOLO los datos que un visitante externo puede
-- ver (nombre, categoría, medidas, precio de venta), sin tocar la
-- política de RLS "solo usuarios autenticados" que ya protege la
-- tabla `productos` (precio de compra, descuento de proveedor,
-- stock actual, stock mínimo, etc. quedan totalmente ocultos).
--
-- Cómo funciona: una vista creada por el rol dueño del esquema
-- (postgres, que es el que corre este script en el SQL Editor de
-- Supabase) se evalúa con los permisos del dueño y NO queda sujeta
-- a las políticas RLS de `productos` a menos que se marque
-- explícitamente "security_invoker". Por eso alcanza con darle
-- permiso de lectura al rol "anon" sobre la vista, sin tocar ni
-- debilitar el RLS de la tabla original.
--
-- Ejecutar esto en el SQL Editor de Supabase del MISMO proyecto
-- que ya usa el sistema de stock (no hace falta un proyecto nuevo).

create or replace view public.catalogo_publico as
select
  p.id,
  p.codigo,
  p.nombre,
  p.medidas,
  p.precio_venta,
  c.nombre as categoria
from productos p
left join categorias c on c.id = p.categoria_id
where p.activo = true
order by c.nombre, p.nombre;

-- Aseguramos que la vista NO herede el RLS restrictivo de productos
-- (comportamiento por defecto en Postgres, pero lo dejamos explícito).
alter view public.catalogo_publico set (security_invoker = false);

-- Le damos acceso de solo lectura al visitante anónimo de la web.
grant select on public.catalogo_publico to anon;
grant select on public.catalogo_publico to authenticated;

-- Nada más cambia: la tabla `productos` sigue exigiendo usuario
-- autenticado para cualquier lectura o escritura directa, igual
-- que hoy en el sistema de stock.
