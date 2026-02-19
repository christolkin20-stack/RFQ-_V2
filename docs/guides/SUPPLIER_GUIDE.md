# Supplier Guide — Průvodce pro dodavatele

Tento průvodce popisuje, jak jako dodavatel vyplnit a odeslat cenovou nabídku přes Supplier Portal.

---

## 1) Přístup k portálu

Obdržíte odkaz ve formátu:
```
https://<domena>/supplier-portal/<token>/
```

- **Není třeba se přihlašovat** — přístup je přes unikátní token
- Odkaz je jednorázový pro konkrétní projekt a dodavatele
- Pokud odkaz nefunguje, kontaktujte nákupčího pro nový

---

## 2) Přehled požadavku

Po otevření portálu vidíte:
- **Název projektu** a kupující firmu
- **Seznam položek** s detaily:
  - Číslo výkresu (Drawing No)
  - Popis (Description)
  - Výrobce a katalogové číslo (MPN)
  - Požadované množství (Qty)
  - Případné přílohy/specifikace

---

## 3) Vyplnění nabídky

Pro každou položku vyplňte:

| Pole | Popis | Povinné |
|------|-------|---------|
| **Unit Price** | Cena za kus | Ano |
| **MOQ** | Minimální objednací množství | Ne (default 1) |
| **Lead Time** | Dodací lhůta (dny/týdny) | Doporučeno |
| **Currency** | Měna (CZK, EUR, USD...) | Ano |
| **Incoterms** | Dodací podmínky (EXW, DDP...) | Ne |
| **Validity** | Platnost nabídky (dny) | Doporučeno |
| **Notes** | Poznámky, upřesnění | Ne |

### Více cenových tierů
U položek s různými qty breakpointy můžete zadat více cen pro různá množství.

---

## 4) No Bid

Pokud na položku nemůžete nabídnout:
1. Označte položku jako **No Bid**
2. Uveďte důvod (nedostupnost, mimo sortiment, kapacita...)
3. No Bid se zaznamená a nákupčí bude informován

---

## 5) Uložení konceptu (Draft)

- Klikněte **Save as Draft** kdykoliv během vyplňování
- Rozpracovaná nabídka se uloží
- Můžete se vrátit přes stejný odkaz a pokračovat
- Draft nevidí nákupčí — je viditelný až po odeslání

---

## 6) Odeslání nabídky (Submit)

1. Zkontrolujte všechny vyplněné položky
2. Klikněte **Submit**
3. Po odeslání je nabídka **read-only** — nelze ji editovat
4. Zobrazí se potvrzení o úspěšném odeslání

---

## 7) Životní cyklus nabídky

```
Draft → Submitted → Approved / Rejected
                          ↓
                       Reopen → Draft (nová verze)
```

| Status | Popis |
|--------|-------|
| **Draft** | Rozpracovaná nabídka, lze editovat |
| **Submitted** | Odeslaná, čeká na posouzení nákupčím |
| **Approved** | Nabídka přijata (nebo její část) |
| **Rejected** | Nabídka zamítnuta |
| **Reopen** | Nákupčí požádal o úpravu — můžete editovat znovu |

---

## 8) Přílohy

K nabídce můžete přiložit soubory:
- Certifikáty kvality
- Technické specifikace (spec sheets)
- Katalogové listy
- Výrobní dokumentace

**Podporované formáty:** PDF, XLSX, DOCX, PNG, JPG
**Max. velikost:** závisí na konfiguraci serveru

---

## Časté otázky

**Q: Odkaz nefunguje / zobrazuje chybu?**
A: Token mohl expirovat. Kontaktujte nákupčího pro nový odkaz.

**Q: Mohu upravit odeslanou nabídku?**
A: Ne, po Submit je nabídka read-only. Požádejte nákupčího o Reopen.

**Q: Musím vyplnit všechny položky?**
A: Ne, položky které nemůžete nabídnout označte jako No Bid.

**Q: Kdo vidí moji nabídku?**
A: Pouze nákupčí a uživatelé s přístupem k danému projektu.
