# FAQ — Často kladené otázky

---

## Obecné

### Co je RFQ systém?
RFQ (Request for Quotation) je webová aplikace pro správu poptávkových řízení. Umožňuje nákupčím vytvářet projekty, spravovat položky, posílat poptávky dodavatelům a porovnávat cenové nabídky.

### Jaké role existují?
- **Viewer** — jen čtení, vidí projekty své firmy
- **Editor** — editace projektů, správa položek a dodavatelů
- **Admin** — správa uživatelů a nastavení v rámci firmy
- **Superadmin** — globální správa (firmy, uživatelé, audit, locky)

### Jaké prohlížeče jsou podporovány?
Moderní prohlížeče: Chrome, Firefox, Edge, Safari. Doporučujeme Chrome pro nejlepší výkon.

---

## Projekty a položky

### Jak vytvořím nový projekt?
1. Klikněte na **+ New Project** v sidebaru
2. Vyplňte název a popis
3. Projekt se vytvoří se statusem "Created"

### Jak importuji položky z Excelu?
1. Otevřete projekt
2. Klikněte **Import** v horní liště
3. Vyberte XLSX soubor se sloupci: Drawing No, Description, Manufacturer, MPN, Qty
4. Systém namapuje sloupce automaticky

### Co znamenají statusy položek?
| Status | Význam |
|--------|--------|
| **New** | Nově přidaná položka |
| **TO-QUOTE** | Připravena k poptání |
| **RFQ Sent** | Poptávka odeslána dodavatelům |
| **Quote Received** | Přijata nabídka od dodavatele |
| **Comparison** | V procesu cenového porovnání |
| **Selected** | Vybrán dodavatel |
| **Done** | Uzavřeno |

### Jak funguje bulk delete?
1. Vyberte položky (checkboxy)
2. V bulk action baru klikněte **Delete**
3. Potvrďte v danger dialogu
4. Napište "DELETE" pro finální potvrzení
5. Položky jsou trvale smazány

---

## Dodavatelé a nabídky

### Jak vygeneruji odkaz pro dodavatele?
1. Přejděte na tab **Quoting Process** (RFQ Planner)
2. Přiřaďte dodavatele k položkám
3. Klikněte **Generate Link** u dodavatele
4. Zkopírujte odkaz a pošlete emailem

### Co když dodavatel neodpovídá?
- Zkontrolujte status odkazu v Quoting Process
- Pošlete připomínku s novým odkazem
- Nastavte deadline a sledujte v přehledu

### Jak porovnám cenové nabídky?
1. Přejděte na tab **Price Comparison**
2. Vidíte tabulku: položky × dodavatelé s cenami
3. Kliknutím vyberte hlavního dodavatele (isMain)
4. Exportujte porovnání do Excelu

### Co je "No Bid"?
Dodavatel označí položku jako No Bid, pokud na ni nemůže nabídnout (nedostupnost, mimo sortiment). Důvod se zobrazí v detailu položky.

---

## Administrace

### Proč nemohu editovat projekt?
Projekt je pravděpodobně zamčený jiným uživatelem. Vidíte zprávu "Locked by [username]".
- Počkejte 3 minuty na automatické odemčení
- Nebo požádejte admina o force unlock v Mega Admin

### Jak resetuji heslo uživateli?
1. Otevřete Mega Admin → Users
2. Najděte uživatele
3. Klikněte **Reset pass**
4. Zadejte nové heslo

### Jak zjistím, kdo co změnil?
1. Otevřete Mega Admin → Audit Logs
2. Filtrujte podle akce, entity, aktéra nebo časového rozsahu
3. Každý záznam ukazuje: akci, entitu, aktéra a čas

### Jak použiju bulk operace v admin panelu?
**Bulk role change:**
1. Zaškrtněte checkboxy u uživatelů
2. Vyberte roli z dropdownu v bulk baru
3. Klikněte **Apply Role**

**Bulk deactivate:**
1. Zaškrtněte uživatele
2. Klikněte **Deactivate**

**Bulk unlock:**
1. Zaškrtněte locky
2. Klikněte **Unlock Selected**

---

## Import / Export

### V jakém formátu exportuji data?
Export je v **XLSX** formátu (Microsoft Excel). Obsahuje všechny viditelné sloupce plus status.

### Proč nefunguje Excel export?
Systém vyžaduje XLSX knihovnu (xlsx.full.min.js). Pokud vidíte chybu:
- Ověřte internetové připojení (knihovna se načítá z CDN)
- Nebo zkontrolujte, zda je knihovna zahrnutá v static souborech

---

## Řešení problémů

### "CSRF token missing" chyba
- Ověřte, že `DJANGO_CSRF_TRUSTED_ORIGINS` obsahuje vaši doménu
- Zkuste smazat cookies a přihlásit se znovu
- V produkci musí být HTTPS

### Projekt se nezobrazuje
Možné příčiny:
- **Company isolation:** projekt patří jiné firmě
- **Project ACL:** nemáte přístup k projektu (požádejte admina)
- **Filtr:** zkontrolujte aktivní filtry v sidebaru

### Zamčený záznam nelze editovat
- Lock expiruje automaticky po 3 minutách
- Admin může force unlock v Mega Admin → Active Locks
- Klikněte **Refresh** pro aktualizaci stavu

### Supplier portál neukazuje data
- Token mohl expirovat — vygenerujte nový
- Ověřte, že projekt existuje a má položky
- Zkontrolujte, zda je SupplierAccess záznam aktivní
