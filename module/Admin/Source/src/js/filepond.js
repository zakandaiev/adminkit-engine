@@include("../../node_modules/filepond/dist/filepond.min.js")
@@include("../../node_modules/filepond-plugin-file-validate-size/dist/filepond-plugin-file-validate-size.min.js")
@@include("../../node_modules/filepond-plugin-file-validate-type/dist/filepond-plugin-file-validate-type.min.js")
@@include("../../node_modules/filepond-plugin-file-poster/dist/filepond-plugin-file-poster.min.js")
@@include("../../node_modules/filepond-plugin-image-preview/dist/filepond-plugin-image-preview.min.js")
@@include("../../node_modules/filepond-plugin-media-preview/dist/filepond-plugin-media-preview.min.js")
@@include("../../node_modules/filepond-plugin-pdf-preview/dist/filepond-plugin-pdf-preview.min.js")
@@include("../../node_modules/filepond-plugin-image-exif-orientation/dist/filepond-plugin-image-exif-orientation.min.js")

FilePond.registerPlugin(
	FilePondPluginFileValidateSize,
	FilePondPluginFileValidateType,
	FilePondPluginFilePoster,
	FilePondPluginImagePreview,
	FilePondPluginMediaPreview,
	FilePondPluginPdfPreview,
	FilePondPluginImageExifOrientation
);
