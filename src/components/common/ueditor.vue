<template>
  <div>
    <script id="editor" type="text/plain"></script>
  </div>
</template>
<script>
  export default {
    data() {
      return {
        editor: null,
        toolbars: [
          [
            "source",
            "|",
            "undo",
            "redo",
            "|",
            "bold",
            "italic",
            "underline",
            "strikethrough",
            "|",
            "superscript",
            "subscript",
            "|",
            "forecolor",
            "backcolor",
            "|",
            "removeformat",
            "|",
            "insertorderedlist",
            "insertunorderedlist",
            "|",
            "selectall",
            "cleardoc",
            "paragraph",
            "fontfamily",
            "fontsize",
            "|",
            "justifyleft",
            "justifycenter",
            "justifyright",
            "|",
            "link",
            "unlink",
            "|",
            "simpleupload",
            "emotion",
            "|",
            "map"
          ]
        ]
      };
    },
    props: {
      value: "",
      config: {}
    },
    watch: {
      value(newVal) {
        this.value = newVal;
        this.editor.setContent(newVal);
      }
    },
    mounted() {
      const _this = this;
      this.editor = window.UE.getEditor("editor", {
        ...this.config,
        toolbars: this.toolbars
      });
      this.editor.addListener("ready", () => {
        this.editor.setContent(this.value);
      });
    },
    methods: {
      getUEContent() {
        return this.editor.getContent();
      },
      getUEContentTxt() {
        return this.editor.getContentTxt();
      },
      setUEContent(html) {
        return this.editor.setContent(html);
      }
    },
    destroyed() {
      this.editor.destroy();
    }
  };
</script>
<style lang="scss" scoped></style>
