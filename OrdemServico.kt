data class OrdemServico(

    val cliente: String,
    val veiculo: String,
    val placa: String,
    val servico: String,
    val descricao: String,

    var status: String,

    var lixamento: Boolean,
    var pintura: Boolean,
    var polimento: Boolean,

    val tempoEstimado: String,
    var tempoReal: String

)
