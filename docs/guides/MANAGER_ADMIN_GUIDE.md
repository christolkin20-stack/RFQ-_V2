# Manager / Admin Guide

Průvodce pro správce systému RFQ — role admin a superadmin.

---

## 1) Přehled rolí

| Role | Popis | Scope |
|------|-------|-------|
| **viewer** | Jen čtení — vidí projekty, nemůže editovat | V rámci firmy |
| **editor** | Editace projektů, správa položek a dodavatelů | V rámci firmy |
| **admin** | Správa uživatelů a nastavení v rámci své firmy | V rámci firmy |
| **superadmin** | Globální správa — firmy, uživatelé, audit, locky | Cross-company |

Navíc existuje flag **is_management** — uživatel s tímto příznakem vidí všechny projekty ve firmě bez ohledu na project ACL.

---

## 2) Mega Admin Dashboard

- **URL:** `/mega-admin/`
- **Přístup:** pouze superadmin nebo Django superuser
- **Sekce:** Companies, Users / Roles, Active Locks, Audit Logs

Statistiky nahoře ukazují celkový počet firem, uživatelů, aktivních locků a načtených audit záznamů.

---

## 3) Správa firem (Companies)

### Vytvoření firmy
Vyplňte pole v kartě Companies a klikněte **Add / Update**:
- **Company name** (povinné)
- VAT (DIČ), Registration No (IČ), adresa, město, PSČ, země

### Editace
Klikněte **Edit** u existující firmy — formulář se předvyplní, tlačítko změní text na "Add / Update". Zrušit editaci: **Cancel edit**.

### Deaktivace
Klikněte **Deactivate** — firma se označí jako neaktivní, její uživatelé ztrácí přístup. Reversibilní operace (Activate).

---

## 4) Správa uživatelů (Users / Roles)

### Vytvoření uživatele
1. Vyplňte username, email, heslo
2. Vyberte roli a firmu
3. Klikněte **Create user**

### Úprava uživatele
Každý řádek uživatele obsahuje:
- **Role select** — změna role (viewer/editor/admin/superadmin)
- **mgmt checkbox** — management příznak
- **active checkbox** — aktivní/neaktivní
- **Company select** — přeřazení do jiné firmy
- **Save** — uloží změny
- **Reset pass** — nastaví nové heslo
- **Delete** — deaktivuje uživatele

### Filtrování
- **Company filter** — zobrazí jen uživatele vybrané firmy
- **Search** — fulltextové hledání v username, email, role, company

### Bulk operace (nové)
1. Zaškrtněte checkboxy u vybraných uživatelů
2. Zobrazí se bulk bar s počtem vybraných
3. **Apply Role** — hromadná změna role (vyberte z dropdownu)
4. **Deactivate** — hromadná deaktivace
5. **Clear** — zrušit výběr

---

## 5) Viditelnost projektů

### Company isolation
Uživatel vidí pouze projekty své firmy. Superadmin vidí vše.

### Project Access ACL
Projekt může mít seznam povolených uživatelů. Uživatel bez přístupu projekt nevidí, i když je ve stejné firmě.

### Management role
Uživatelé s příznakem **is_management** vidí všechny projekty ve firmě bez ohledu na ACL.

---

## 6) Edit Locks

Systém zamykání brání současné editaci stejného záznamu dvěma uživateli.

### Jak to funguje
- Při otevření projektu/položky k editaci se vytvoří lock (TTL 3 minuty)
- Lock se automaticky obnovuje heartbeatem
- Pokud jiný uživatel otevře stejný záznam, vidí upozornění a read-only zobrazení
- Lock expiruje automaticky po 3 minutách bez heartbeatu

### Monitoring locků
V kartě **Active Locks** vidíte:
- Kontext (projekt/položka)
- Kdo zamkl
- Čas expirace

### Force unlock
- **Jednotlivě:** tlačítko "Force unlock" u záznamu
- **Hromadně (nové):** zaškrtněte checkboxy → "Unlock Selected"

---

## 7) Audit Logs

Systém zaznamenává všechny důležité operace.

### Co se loguje
- CRUD operace na projektech, položkách, nabídkách
- Přihlášení, odhlášení
- Změny rolí a přístupů
- Force unlock operace
- Export dat

### Filtrování
| Filtr | Popis |
|-------|-------|
| **action** | Typ akce (create, update, delete, login...) |
| **entity** | Typ entity (project, item, quote...) |
| **actor** | Jméno uživatele (client-side filtr) |
| **date from / to** | Časový rozsah (nové) |

Filtry action a entity se posílají na server, actor se filtruje lokálně.

---

## 8) Bezpečnostní doporučení

- Používejte silná hesla (min. 12 znaků)
- Superadmin role přidělujte minimálnímu počtu uživatelů
- Pravidelně kontrolujte audit logy (min. 1x týdně)
- Deaktivujte uživatele, kteří odešli z firmy
- Kontrolujte aktivní locky — stuck locky můžou blokovat práci
- Nastavte `DJANGO_DEBUG=0` v produkci
- Používejte HTTPS v produkci
