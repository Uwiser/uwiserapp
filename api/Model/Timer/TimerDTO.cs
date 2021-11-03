namespace Model.Timer
{
    public class TimerDTO
    {
        public int intervalo { get; set; }
        public bool ativo { get; set; }
        public TimerDTO(int intervalo)
        {
            this.intervalo = intervalo;
        }
    }
}