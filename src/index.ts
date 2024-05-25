import { defineInterface } from "@directus/extensions-sdk";
import InterfaceComponent from "./interface.vue";

export default defineInterface({
  id: "document-interface",
  name: "Document",
  icon: "quick_reference",
  description: "File upload with preview. Supported file: .doc, .xls, .pdf",
  component: InterfaceComponent,
  types: ["uuid"],
  localTypes: ["file"],
  group: "relational",
  relational: true,
  options: [
    {
      field: "folder",
      name: "$t:interfaces.system-folder.folder",
      type: "uuid",
      meta: {
        width: "full",
        interface: "system-folder",
        note: "$t:interfaces.system-folder.field_hint",
      },
    },
    {
      field: "token",
      name: "Token",
      type: "string",
      meta: {
        width: "full",
        interface: "input",
        note: "Paste your token here if the file in private folder",
        options: {
          trim: true,
        },
      },
    },
  ],
  recommendedDisplays: ["file"],
});
